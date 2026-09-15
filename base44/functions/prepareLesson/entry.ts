import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const lessonId = String(body.lessonId || '');
    const lang = body.lang === 'en' ? 'en' : 'ar';
    if (!lessonId) return Response.json({ error: 'lessonId required' }, { status: 400 });

    const lesson = await base44.entities.Lesson.get(lessonId);
    if (!lesson) return Response.json({ error: 'Lesson not found' }, { status: 404 });

    if (lesson.content_ready) {
      return Response.json({
        summary: lesson.summary,
        reading_content: lesson.reading_content,
        quiz: lesson.quiz,
        task: lesson.task,
        video_url: lesson.video_url,
        video_title: lesson.video_title,
        content_ready: true
      });
    }

    const roadmap = await base44.entities.Roadmap.get(lesson.roadmap_id);
    if (!roadmap) return Response.json({ error: 'Roadmap not found' }, { status: 404 });

    const isStageProject = lesson.node_id?.startsWith('stage_project_');

    const profiles = await base44.entities.LearningProfile.filter({}, "-created_date", 1);
    const profile = profiles[0] || {};
    const level = profile.current_level || (lesson.phase <= 2 ? 'beginner' : 'intermediate');

    // === STAGE PROJECT ===
    if (isStageProject) {
      const phaseNodes = (roadmap?.nodes || []).filter(n => (n.phase || 1) === lesson.phase);
      const phaseSkills = [...new Set(phaseNodes.flatMap(n => n.skills || []))];
      const phaseTitles = phaseNodes.map(n => n.title).join(", ");
      const goal = profile.goal || '';

      const prompt = `You are ZEUS building a Stage Project for Phase ${lesson.phase} of a learning roadmap.
Goal: ${goal}
Phase ${lesson.phase} topics: ${phaseTitles}
Skills covered: ${phaseSkills.join(", ")}
Learner level: ${level}

Create a comprehensive Stage Project that combines ALL skills from this phase into one real-world project. The project must be:
- A real, portfolio-worthy project (not a toy exercise)
- Buildable by a ${level} learner in 1-2 weeks
- Something that demonstrates mastery of the phase's skills

Generate:
1. "summary": 2-3 sentence overview of what the project is and why it matters. ${lang === 'ar' ? 'In Egyptian Arabic.' : 'In English.'}

2. "reading_content": A detailed project specification in markdown with these sections:
   ## Overview
   (What this project is, real-world context, why it matters)
   ## Goal
   (What the student will build and learn)
   ## Requirements
   (Detailed functional requirements — what the project must do, feature by feature)
   ## Skills You'll Practice
   (List of skills from this phase that the project uses)
   ## Step-by-Step Guide
   (5-8 clear steps to build the project, with sub-steps)
   ## Deliverables
   (What to submit: code, demo, documentation)
   ## Evaluation Criteria
   (How to know it's done well — specific checklist)
   ## Resources
   (2-3 helpful resources with real URLs)
   ${lang === 'ar' ? 'Write in Egyptian Arabic but keep code/technical terms in English.' : 'Write in English.'}

3. "task": An object with:
   - "title": Project name
   - "description": What they will build and why
   - "steps": Array of 5-8 build steps
   - "deliverables": What to submit
   - "completion_criteria": How to know it's done
   - "applied_skills": Array of skills practiced
   ${lang === 'ar' ? 'In Egyptian Arabic.' : 'In English.'}

4. "quiz": An array of 5 reflection questions about the project (not technical quiz, but project planning questions). Each has: "question", "options" (4 strings), "correct" (index), "explanation".
   ${lang === 'ar' ? 'In Egyptian Arabic.' : 'In English.'}

Output as JSON matching the schema.`;

      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        model: 'automatic',
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            reading_content: { type: 'string' },
            quiz: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correct: { type: 'number' },
                  explanation: { type: 'string' }
                },
                required: ['question', 'options', 'correct']
              }
            },
            task: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                steps: { type: 'array', items: { type: 'string' } },
                deliverables: { type: 'string' },
                completion_criteria: { type: 'string' },
                applied_skills: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          required: ['summary', 'reading_content', 'task', 'quiz']
        }
      });

      const content = {
        summary: result.summary || '',
        reading_content: result.reading_content || '',
        quiz: Array.isArray(result.quiz) ? result.quiz : [],
        task: result.task || null,
        video_url: '',
        video_title: '',
        content_ready: true
      };
      await base44.entities.Lesson.update(lessonId, content);
      return Response.json(content);
    }

    // === REGULAR LESSON ===
    const node = (roadmap?.nodes || []).find(n => n.id === lesson.node_id);
    if (!node) return Response.json({ error: 'Node not found' }, { status: 404 });

    const resources = (node.resources || []).slice().sort((a, b) => (a.rank || 99) - (b.rank || 99));
    let videoUrl = (resources.find(r => r.type === 'video' && r.url) || resources.find(r => r.url))?.url || '';
    let videoTitle = (resources.find(r => r.type === 'video' && r.url) || resources.find(r => r.url))?.title || '';

    // Search for a video if none exists
    if (!videoUrl) {
      try {
        const videoResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `Find ONE real, working YouTube video that teaches "${node.title}" (${node.objective || ''}) for a ${level} learner. Return the full YouTube URL and title. Only return a URL you actually found — do NOT invent one.`,
          model: 'gemini_3_flash',
          add_context_from_internet: true,
          response_json_schema: {
            type: 'object',
            properties: {
              video_url: { type: 'string' },
              video_title: { type: 'string' }
            },
            required: ['video_url']
          }
        });
        if (videoResult.video_url && videoResult.video_url.includes('youtube')) {
          videoUrl = videoResult.video_url;
          videoTitle = videoResult.video_title || node.title;
        }
      } catch (e) {}
    }

    const prompt = `You are a teacher preparing a lesson for a student.

LESSON: ${node.title}
OBJECTIVE: ${node.objective || ''}
SKILLS: ${(node.skills || []).join(', ')}
LEARNER LEVEL: ${level}

Generate:
1. "summary": A lesson summary (2-3 sentences) telling the learner what they'll learn and what they'll be able to do after. ${lang === 'ar' ? 'In Egyptian Arabic.' : 'In English.'}

2. "reading_content": A well-structured markdown lesson (1000-2000 words) teaching this topic like a teacher explaining to a student. Structure:
   - Introduction (why this matters, real-world context)
   - Key concept explanation (clear, simple language)
   - Step-by-step breakdown with examples
   - Code examples where relevant (in code blocks)
   - Common mistakes and how to avoid them
   - Mini practice exercise
   - Summary of key points
   - Review questions
   Use proper markdown: ## headings, ### subheadings, **bold**, lists, code blocks, and tables where appropriate. ${lang === 'ar' ? 'Write in Egyptian Arabic but keep code/technical terms in English.' : 'Write in English.'}

3. "quiz": An array of 20 multiple-choice questions. Each has: "question", "options" (array of 4 strings), "correct" (index 0-3), "explanation" (why the correct answer is right). Questions must:
   - Test UNDERSTANDING and APPLICATION, not memorization
   - Be clear and unambiguous
   - Cover different aspects of the lesson (concepts, application, edge cases, common mistakes)
   - Vary in difficulty (easy, medium, hard)
   ${lang === 'ar' ? 'Questions and options in Egyptian Arabic.' : 'In English.'}

4. "task": A practical hands-on task for the student to complete after the lesson:
   - "title": Short task title
   - "description": What they will build and WHY (real-world context)
   - "steps": Array of clear step-by-step instructions
   - "deliverables": What they need to submit
   - "completion_criteria": How to know it's done correctly
   - "applied_skills": Array of skills this task practices
   ${lang === 'ar' ? 'In Egyptian Arabic.' : 'In English.'}

Output as JSON matching the schema.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'automatic',
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          reading_content: { type: 'string' },
          quiz: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                options: { type: 'array', items: { type: 'string' } },
                correct: { type: 'number' },
                explanation: { type: 'string' }
              },
              required: ['question', 'options', 'correct']
            }
          },
          task: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              steps: { type: 'array', items: { type: 'string' } },
              deliverables: { type: 'string' },
              completion_criteria: { type: 'string' },
              applied_skills: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        required: ['summary', 'reading_content', 'quiz', 'task']
      }
    });

    const content = {
      summary: result.summary || '',
      reading_content: result.reading_content || '',
      quiz: Array.isArray(result.quiz) ? result.quiz : [],
      task: result.task || null,
      video_url: videoUrl,
      video_title: videoTitle,
      content_ready: true
    };

    await base44.entities.Lesson.update(lessonId, content);
    return Response.json(content);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
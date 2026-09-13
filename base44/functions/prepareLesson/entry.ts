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
    const node = (roadmap?.nodes || []).find(n => n.id === lesson.node_id);
    if (!node) return Response.json({ error: 'Node not found' }, { status: 404 });

    const profiles = await base44.entities.LearningProfile.filter({}, "-created_date", 1);
    const profile = profiles[0] || {};
    const level = profile.current_level || (lesson.phase <= 2 ? 'beginner' : 'intermediate');

    const resources = (node.resources || []).slice().sort((a, b) => (a.rank || 99) - (b.rank || 99));
    const videoResource = resources.find(r => r.type === 'video' && r.url) || resources.find(r => r.url);
    const videoUrl = videoResource?.url || '';
    const videoTitle = videoResource?.title || '';

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
      model: 'claude-sonnet-5',
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
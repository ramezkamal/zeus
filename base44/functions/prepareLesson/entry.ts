import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

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

    const prompt = `You are preparing a learning lesson for a student.

LESSON: ${node.title}
OBJECTIVE: ${node.objective || ''}
SKILLS: ${(node.skills || []).join(', ')}
LEARNER LEVEL: ${level}

Generate:
1. "summary": A lesson summary (2-3 sentences) telling the learner what they'll learn and what they'll be able to do after. ${lang === 'ar' ? 'In Egyptian Arabic.' : 'In English.'}
2. "reading_content": A well-organized markdown lesson (800-1500 words) teaching this topic. Include: introduction, key concepts with clear explanations, code examples where relevant, key takeaways, and a mini-summary. Use proper markdown formatting (##, ###, **, lists, code blocks). ${lang === 'ar' ? 'Write in Egyptian Arabic but keep code/technical terms in English.' : 'Write in English.'}
3. "quiz": An array of 5 multiple-choice questions. Each has: "question", "options" (array of 4 strings), "correct" (index 0-3), "explanation" (why the correct answer is right). Questions should test understanding, not just memorization. ${lang === 'ar' ? 'Questions and options in Egyptian Arabic.' : 'In English.'}

Output as JSON matching the schema.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gpt_5_mini',
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
          }
        },
        required: ['summary', 'reading_content', 'quiz']
      }
    });

    const content = {
      summary: result.summary || '',
      reading_content: result.reading_content || '',
      quiz: Array.isArray(result.quiz) ? result.quiz : [],
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
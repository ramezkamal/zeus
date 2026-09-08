import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { ZEUS_SYSTEM } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const lessonId = String(body.lessonId || '');
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const lang = body.lang === 'en' ? 'en' : 'ar';
    if (!lessonId) return Response.json({ error: 'lessonId required' }, { status: 400 });

    const lesson = await base44.entities.Lesson.get(lessonId);
    if (!lesson) return Response.json({ error: 'Lesson not found' }, { status: 404 });

    const roadmap = await base44.entities.Roadmap.get(lesson.roadmap_id);
    const node = (roadmap?.nodes || []).find(n => n.id === lesson.node_id);

    const profiles = await base44.entities.LearningProfile.filter({}, "-created_date", 1);
    const profile = profiles[0] || {};

    const contextBlock = `LESSON: ${node?.title || lesson.node_title}
OBJECTIVE: ${node?.objective || ''}
SKILLS: ${(node?.skills || []).join(', ') || ''}
USER LEVEL: ${profile.current_level || 'beginner'}
USER GOAL: ${profile.goal || roadmap?.goal || ''}`;

    const history = messages.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n');

    const prompt = `${ZEUS_SYSTEM}

=== TUTORING CONTEXT ===
You are tutoring this student IN A SPECIFIC LESSON. Stay focused on this lesson's topic.
${contextBlock}

The student is studying this lesson right now. Answer their questions about this topic. Explain at their level, with examples when helpful. Be concise (1-3 sentences). If they ask about something unrelated to this lesson, gently steer back.

=== CONVERSATION ===
${history}

Reply in ${lang === 'ar' ? 'natural Egyptian Arabic' : 'English'}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gpt_5_mini',
      response_json_schema: {
        type: 'object',
        properties: {
          reply: { type: 'string' }
        },
        required: ['reply']
      }
    });

    return Response.json({ reply: result.reply || '' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
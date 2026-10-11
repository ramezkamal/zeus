import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Rubric-based evaluation of a stage project + readiness decision.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { lessonId, submission = '', link = '', lang = 'en' } = await req.json();
    const text = String(submission).slice(0, 6000);
    if (!lessonId || text.trim().length < 30) return Response.json({ error: 'Describe your project (at least 30 characters).' }, { status: 400 });

    const lesson = await base44.entities.Lesson.get(lessonId);
    if (!lesson?.node_id?.startsWith('stage_project_')) return Response.json({ error: 'Not a stage project' }, { status: 400 });
    const profiles = await base44.entities.LearningProfile.list('-created_date', 1);
    const profile = profiles[0];
    const t = lesson.task || {};

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a strict but fair senior reviewer assessing a learner's stage project.
PROJECT: ${t.title || lesson.node_title}
BRIEF: ${t.description || ''}
DELIVERABLES: ${t.deliverables || ''}
COMPLETION CRITERIA: ${t.completion_criteria || ''}
SKILLS: ${(t.applied_skills || []).join(', ')}
LEARNER GOAL: ${profile?.goal || ''} | LEVEL: ${profile?.current_level || ''}

SUBMISSION:
${text}
LINK: ${String(link).slice(0, 300) || 'none'}

Score against 5 criteria (0-100 each): Requirements coverage, Technical correctness, Quality & structure, Applied skills, Explanation & reflection.
Be evidence-based: if the submission is vague, score low. overall = weighted average.
decision: "advance" if overall >= 75, "strengthen" if 55-74, "redo" if < 55.
Give 2-4 strengths, 2-4 gaps, 3 concrete next steps. ${lang === 'ar' ? 'Write feedback in Egyptian Arabic (keep technical terms in English).' : 'Write in English.'}`,
      model: 'automatic',
      response_json_schema: {
        type: 'object',
        properties: {
          overall: { type: 'number' },
          decision: { type: 'string', enum: ['advance', 'strengthen', 'redo'] },
          criteria: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, score: { type: 'number' }, feedback: { type: 'string' } } } },
          strengths: { type: 'array', items: { type: 'string' } },
          gaps: { type: 'array', items: { type: 'string' } },
          next_steps: { type: 'array', items: { type: 'string' } }
        },
        required: ['overall', 'decision', 'criteria']
      }
    });

    const overall = Math.max(0, Math.min(100, Math.round(result.overall || 0)));
    const assessment = { ...result, overall, submission: text, link, date: new Date().toISOString() };
    const update = { assessment };
    let nextLessonId = null;

    if (result.decision === 'advance') {
      Object.assign(update, { status: 'completed', quiz_passed: true, quiz_score: overall, completed_date: new Date().toISOString().slice(0, 10) });
      const next = await base44.entities.Lesson.filter({ roadmap_id: lesson.roadmap_id, order: { $gt: lesson.order }, status: 'locked' }, 'order', 1);
      if (next.length) { await base44.entities.Lesson.update(next[0].id, { status: 'available' }); nextLessonId = next[0].id; }
    }
    await base44.entities.Lesson.update(lessonId, update);

    return Response.json({ assessment, nextLessonId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
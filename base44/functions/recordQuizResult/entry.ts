import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Blends quiz evidence into the learner's skill graph and creates a remedial lesson after repeated failure.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { lessonId, score, missed = [] } = await req.json();
    if (!lessonId || typeof score !== 'number') return Response.json({ error: 'lessonId and score required' }, { status: 400 });
    const s = Math.max(0, Math.min(100, Math.round(score)));
    const passed = s >= 70;

    const lesson = await base44.entities.Lesson.get(lessonId);
    if (!lesson) return Response.json({ error: 'Lesson not found' }, { status: 404 });
    const [roadmap, profiles] = await Promise.all([
      base44.entities.Roadmap.get(lesson.roadmap_id).catch(() => null),
      base44.entities.LearningProfile.list('-created_date', 1),
    ]);
    const profile = profiles[0];
    const node = (roadmap?.nodes || []).find((n) => n.id === lesson.node_id);
    const attempts = (lesson.attempts || 0) + 1;

    // 1) Update Learner DNA (skill graph) with weighted evidence
    let skillChanges = [];
    if (profile) {
      const skills = (node?.skills?.length ? node.skills : (lesson.task?.applied_skills || [])).slice(0, 8);
      const graph = (profile.skill_graph || []).map((g) => ({ ...g }));
      const weight = passed ? 0.3 : 0.15;
      for (const name of skills) {
        const g = graph.find((x) => x.skill?.toLowerCase() === name.toLowerCase());
        const before = g ? g.level : 0;
        const target = passed ? Math.max(s, before + 5) : s;
        const after = Math.max(0, Math.min(100, Math.round(before * (1 - weight) + target * weight)));
        if (g) g.level = after; else graph.push({ skill: name, level: after });
        skillChanges.push({ skill: name, before, after });
      }
      if (skillChanges.length) {
        const version = (profile.dna_version || 1) + 1;
        const history = [...(profile.dna_history || []), { version: profile.dna_version || 1, date: new Date().toISOString(), source: `quiz:${lesson.node_title}`, skill_graph: profile.skill_graph || [] }].slice(-20);
        await base44.entities.LearningProfile.update(profile.id, { skill_graph: graph, dna_version: version, dna_history: history });
      }
    }

    await base44.entities.Lesson.update(lessonId, { attempts });

    // 2) Adaptive remediation after 2 failed attempts
    let remedialLessonId = null;
    if (!passed && attempts >= 2 && !lesson.is_remedial) {
      const existing = await base44.entities.Lesson.filter({ remedial_for: lessonId }, '-created_date', 1);
      if (existing.length) {
        remedialLessonId = existing[0].id;
      } else {
        const focus = missed.slice(0, 8).map((q) => String(q).slice(0, 200)).join(' | ');
        const created = await base44.entities.Lesson.create({
          roadmap_id: lesson.roadmap_id,
          node_id: lesson.node_id,
          node_title: `${lesson.node_title} · Review`,
          phase: lesson.phase,
          day: lesson.day,
          week: lesson.week,
          order: (lesson.order || 0) - 0.5,
          status: 'available',
          is_remedial: true,
          remedial_for: lessonId,
          remedial_focus: focus,
          content_ready: false,
        });
        remedialLessonId = created.id;
        await base44.entities.Notification.create({
          type: 'lesson', title: 'Review lesson ready', body: `ZEUS prepared a focused review for "${lesson.node_title}".`,
          action_label: 'Open', action_url: `/lesson/${created.id}`,
        });
      }
    }

    return Response.json({ passed, attempts, skillChanges, remedialLessonId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
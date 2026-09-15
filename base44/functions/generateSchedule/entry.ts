import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const DAY_MAP = {
  'monday': 'monday', 'الاثنين': 'monday', 'الإثنين': 'monday', 'mon': 'monday',
  'tuesday': 'tuesday', 'الثلاثاء': 'tuesday', 'tue': 'tuesday',
  'wednesday': 'wednesday', 'الأربعاء': 'wednesday', 'wed': 'wednesday',
  'thursday': 'thursday', 'الخميس': 'thursday', 'thu': 'thursday',
  'friday': 'friday', 'الجمعة': 'friday', 'fri': 'friday',
  'saturday': 'saturday', 'السبت': 'saturday', 'sat': 'saturday',
  'sunday': 'sunday', 'الأحد': 'sunday', 'sun': 'sunday'
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const roadmapId = String(body.roadmapId || '');
    const availableDays = Array.isArray(body.availableDays) ? body.availableDays : [];
    if (!roadmapId) return Response.json({ error: 'roadmapId required' }, { status: 400 });

    const roadmap = await base44.entities.Roadmap.get(roadmapId);
    if (!roadmap) return Response.json({ error: 'Roadmap not found' }, { status: 404 });

    const nodes = (roadmap.nodes || []).slice().sort((a, b) => (a.phase || 1) - (b.phase || 1));
    if (!nodes.length) return Response.json({ error: 'No nodes in roadmap' }, { status: 400 });

    const days = (availableDays.length ? availableDays : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
      .map(d => DAY_MAP[String(d).toLowerCase()] || String(d).toLowerCase())
      .filter(Boolean);
    const uniqueDays = [...new Set(days)];

    await base44.entities.Lesson.deleteMany({ roadmap_id: roadmapId });

    const phases = [...new Set(nodes.map(n => n.phase || 1))].sort((a, b) => a - b);
    const lessons = [];
    let order = 0;

    phases.forEach(phase => {
      const phaseNodes = nodes.filter(n => (n.phase || 1) === phase);
      phaseNodes.forEach(node => {
        const hours = node.estimated_hours || 4;
        const numLessons = Math.min(Math.max(1, Math.ceil(hours / 3)), 4);
        for (let i = 0; i < numLessons; i++) {
          lessons.push({
            roadmap_id: roadmapId,
            node_id: node.id,
            node_title: numLessons > 1 ? `${node.title} (${i + 1}/${numLessons})` : node.title,
            phase: phase,
            day: uniqueDays[order % uniqueDays.length],
            week: Math.floor(order / uniqueDays.length) + 1,
            order: order,
            status: order === 0 ? 'available' : 'locked'
          });
          order++;
        }
      });
      // Stage project at end of each phase
      if (phaseNodes.length > 0) {
        lessons.push({
          roadmap_id: roadmapId,
          node_id: `stage_project_${phase}`,
          node_title: `Stage Project: Phase ${phase}`,
          phase: phase,
          day: uniqueDays[order % uniqueDays.length],
          week: Math.floor(order / uniqueDays.length) + 1,
          order: order,
          status: 'locked'
        });
        order++;
      }
    });

    const created = await base44.entities.Lesson.bulkCreate(lessons);
    return Response.json({ success: true, lessons: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
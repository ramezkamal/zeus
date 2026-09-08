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

    const lessons = nodes.map((node, i) => ({
      roadmap_id: roadmapId,
      node_id: node.id,
      node_title: node.title,
      phase: node.phase || 1,
      day: uniqueDays[i % uniqueDays.length],
      week: Math.floor(i / uniqueDays.length) + 1,
      order: i,
      status: i === 0 ? 'available' : 'locked'
    }));

    const created = await base44.entities.Lesson.bulkCreate(lessons);
    return Response.json({ success: true, lessons: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
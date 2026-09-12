import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const userId = String(body.userId || '');
    if (!userId) return Response.json({ error: 'userId required' }, { status: 400 });

    const [cvs, projects] = await Promise.all([
      base44.asServiceRole.entities.CV.filter({ created_by_id: userId }, "-created_date", 1),
      base44.asServiceRole.entities.Project.filter({ created_by_id: userId, status: "completed" }, "-created_date", 50)
    ]);

    return Response.json({
      cv: cvs[0] || null,
      projects: projects || []
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
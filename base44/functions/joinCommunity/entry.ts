import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const communityId = body.communityId;
    const action = body.action === 'leave' ? 'leave' : 'join';
    if (!communityId) return Response.json({ error: 'communityId required' }, { status: 400 });

    const list = await base44.asServiceRole.entities.Community.filter({ id: communityId });
    if (!list.length) return Response.json({ error: 'Community not found' }, { status: 404 });
    const community = list[0];

    let members = Array.isArray(community.members) ? [...community.members] : [];
    if (action === 'join') {
      if (!members.includes(user.id)) members.push(user.id);
    } else {
      members = members.filter((m) => m !== user.id);
    }
    const updated = await base44.asServiceRole.entities.Community.update(communityId, {
      members,
      member_count: members.length
    });
    return Response.json({ community: updated, joined: members.includes(user.id) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const roadmapId = String(body.roadmapId || '');
    const nodeId = String(body.nodeId || '');
    const lang = body.lang === 'en' ? 'en' : 'ar';
    if (!roadmapId || !nodeId) return Response.json({ error: 'roadmapId and nodeId required' }, { status: 400 });

    const roadmap = await base44.asServiceRole.entities.Roadmap.get(roadmapId);
    if (!roadmap) return Response.json({ error: 'Roadmap not found' }, { status: 404 });
    if (roadmap.created_by_id !== user.id) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const nodes = Array.isArray(roadmap.nodes) ? roadmap.nodes : [];
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return Response.json({ error: 'Node not found' }, { status: 404 });

    const prompt = `Search the web NOW and find the best FREE learning resources for this ONE specific topic.

TOPIC: ${node.title}
GOAL OF THIS TOPIC: ${node.objective || ''}
SKILLS COVERED: ${(node.skills || []).join(', ')}
LEARNER'S OVERALL GOAL: ${roadmap.goal || ''}

Find EXACTLY 5 resources, ranked 1 to 5 by how good they are for someone learning this topic right now:
- At least 2 must be YouTube videos or video courses (type: "video") — real, popular, highly-rated videos actually about this topic.
- At least 1 must be official documentation or a written guide (type: "docs" or "article").
- The rest: a free course (type: "course"), an interactive practice site (type: "interactive"), or a tool (type: "tool").

HARD RULES:
- Every url MUST be a real, working URL you found through your web search. Never invent, guess, or construct a URL.
- If you cannot verify a URL exists, drop that resource and return fewer than 5. Fewer real resources is far better than one fake link.
- For YouTube, return the full watch URL of a specific real video (https://www.youtube.com/watch?v=...), not a channel or a search page.
- rank: 1 is the single best starting point, then 2, 3, 4, 5.
- tier: "best_match" for rank 1-2, "alternative" for rank 3-4, "deep_dive" for rank 5.
- why: one short sentence (max 15 words) on why this resource specifically, and what the learner gets from it.

QUALITY BAR:
- Prefer well-known, reputable sources: official documentation, established YouTube educators, freeCodeCamp, MDN, W3Schools, university or free course platforms.
- Prefer recent content (last 3 years) for fast-moving tech topics.
- Never paywalled or login-walled content — everything must be free to access immediately.
${lang === 'ar' ? '- Prefer a high-quality Arabic-language video when one truly exists for this exact topic; otherwise a top English resource is better than a weak Arabic one.' : ''}

Write title and why in ${lang === 'ar' ? 'natural Egyptian Arabic' : 'English'}. Keep the URL untouched in its original form.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gemini_3_flash',
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          resources: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                type: { type: 'string', enum: ['video', 'docs', 'course', 'article', 'tool', 'interactive'] },
                url: { type: 'string' },
                tier: { type: 'string', enum: ['best_match', 'alternative', 'deep_dive'] },
                rank: { type: 'number' },
                why: { type: 'string' }
              },
              required: ['title', 'type', 'url', 'rank']
            }
          }
        },
        required: ['resources']
      }
    });

    const found = Array.isArray(result?.resources) ? result.resources : [];
    const resources = found
      .filter((r) => r && typeof r.url === 'string' && /^https?:\/\//i.test(r.url))
      .sort((a, b) => (a.rank || 99) - (b.rank || 99))
      .slice(0, 5)
      .map((r, i) => ({
        title: r.title || r.url,
        type: r.type || 'article',
        url: r.url,
        tier: r.tier || (i < 2 ? 'best_match' : i < 4 ? 'alternative' : 'deep_dive'),
        rank: i + 1,
        why: r.why || ''
      }));

    if (!resources.length) {
      return Response.json({ success: false, resources: [], message: 'no_verified_resources' });
    }

    const updatedNodes = nodes.map((n) => (n.id === nodeId ? { ...n, resources } : n));
    await base44.asServiceRole.entities.Roadmap.update(roadmapId, { nodes: updatedNodes });

    return Response.json({ success: true, nodeId, resources, nodes: updatedNodes });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
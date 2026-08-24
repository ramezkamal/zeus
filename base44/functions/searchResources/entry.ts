import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const roadmapId = body.roadmapId;
    const lang = body.lang || "ar";
    if (!roadmapId) return Response.json({ error: 'roadmapId required' }, { status: 400 });

    const roadmap = await base44.entities.Roadmap.get(roadmapId);
    if (!roadmap) return Response.json({ error: 'Roadmap not found' }, { status: 404 });
    if (roadmap.created_by_id !== user.id) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const nodes = roadmap.nodes || [];
    const topics = nodes.map(n => ({ id: n.id, title: n.title, objective: n.objective, skills: n.skills || [] }));

    const prompt = `You are ZEUS, an expert career & learning consultant. For each learning topic below, search the web and find 2-3 REAL, high-quality, FREE resources — prefer official documentation, well-known free courses (freeCodeCamp, MDN, W3Schools, Coursera audit, edX, Khan Academy), and popular YouTube videos/channels. Every URL MUST be a real, working URL you actually found via web search. Do NOT invent, guess, or hallucinate URLs. If you cannot verify a URL, omit that resource entirely.
Return JSON mapping each node_id to its resources.
Topics: ${JSON.stringify(topics)}
For each resource: title, type (one of: video, docs, course, article, tool, interactive), url (real working URL), tier (best_match|alternative|deep_dive).
Titles in ${lang === "ar" ? "Egyptian Arabic" : "English"}. URLs always real and verifiable.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: "gemini_3_flash",
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                node_id: { type: "string" },
                resources: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      type: { type: "string" },
                      url: { type: "string" },
                      tier: { type: "string" }
                    },
                    required: ["title", "type", "url"]
                  }
                }
              },
              required: ["node_id", "resources"]
            }
          }
        },
        required: ["results"]
      }
    });

    const results = Array.isArray(result?.results) ? result.results : [];
    const updatedNodes = nodes.map(n => {
      const match = results.find(r => r.node_id === n.id);
      if (match && Array.isArray(match.resources) && match.resources.length) {
        return { ...n, resources: match.resources };
      }
      return n;
    });
    await base44.entities.Roadmap.update(roadmapId, { nodes: updatedNodes });
    return Response.json({ success: true, nodes: updatedNodes });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
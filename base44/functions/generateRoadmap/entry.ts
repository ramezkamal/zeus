import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ZEUS_SYSTEM, roadmapPrompt } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const profile = body.profile || {};
    const goal = body.goal || profile.goal || "";
    const lang = body.lang || profile.preferred_language || "ar";

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${ZEUS_SYSTEM}\n\n${roadmapPrompt(profile, goal, lang)}`,
      model: "gpt_5_mini",
      response_json_schema: {
        type: "object",
        properties: {
          nodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                phase: { type: "number" },
                objective: { type: "string" },
                skills: { type: "array", items: { type: "string" } },
                estimated_hours: { type: "number" },
                tasks: { type: "array", items: { type: "string" } },
                projects: { type: "array", items: { type: "string" } },
                resources: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      type: { type: "string" },
                      tier: { type: "string" },
                      url: { type: "string" }
                    }
                  }
                },
                parent_ids: { type: "array", items: { type: "string" } }
              },
              required: ["id", "title", "phase", "objective", "tasks"]
            }
          }
        },
        required: ["nodes"]
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
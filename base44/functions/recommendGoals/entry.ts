import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ZEUS_SYSTEM } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const profile = body.profile || {};
    const statedGoal = body.goal || profile.goal || "";

    const prompt = `${ZEUS_SYSTEM}

The user said they want to learn: "${statedGoal}".
Their Learning DNA: ${JSON.stringify(profile)}.

Analyze possible career/learning paths that fit this user. Return 3-5 ranked recommendations with a fit score (0-100) and a short reason for each. Identify the strongest fit. Do not immediately assume the literal goal is the best — reason from their DNA (strengths, weaknesses, time, motivation, career intent).
Reply in ${profile.preferred_language === "en" ? "English" : "Egyptian Arabic"}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: "automatic",
      response_json_schema: {
        type: "object",
        properties: {
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                goal: { type: "string" },
                score: { type: "number" },
                reason: { type: "string" }
              },
              required: ["goal", "score", "reason"]
            }
          },
          topGoal: { type: "string" },
          summary: { type: "string" },
          key_skills: { type: "array", items: { type: "string" } }
        },
        required: ["recommendations", "topGoal", "key_skills"]
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
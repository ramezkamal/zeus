import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
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

The user wants to learn: "${statedGoal}".
Their Learning DNA: ${JSON.stringify(profile)}.

Analyze possible CAREER PATHS that fit this user. Return 3-5 ranked paths with:
- goal: career path name
- score: fit score (0-100) based on personality, interests, skills, goals, time, background
- reason: short reason why it fits
- description: 1-2 sentence description of the path
- key_skills: top 3-5 skills required
- job_titles: 2-3 example job titles
- nature: nature of the work (1 sentence)

Reason from their DNA (strengths, weaknesses, time, motivation, career intent). Do not assume the literal goal is the best.
Reply in ${profile.preferred_language === "en" ? "English" : "Egyptian Arabic"}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: "gpt_5_mini",
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
                reason: { type: "string" },
                description: { type: "string" },
                key_skills: { type: "array", items: { type: "string" } },
                job_titles: { type: "array", items: { type: "string" } },
                nature: { type: "string" }
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
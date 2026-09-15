import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { ZEUS_SYSTEM, discoveryPrompt } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const profile = body.profile || {};
    const companionName = body.companionName || "Zeus";
    const lang = body.lang || (profile.preferred_language) || "ar";

    const transcript = messages.map(m => `${m.role === "user" ? "User" : companionName}: ${m.content}`).join("\n\n");

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${ZEUS_SYSTEM}\n\n${discoveryPrompt(companionName, lang, profile)}\n\n=== CONVERSATION SO FAR ===\n${transcript}\n\n=== YOUR TURN ===\nRespond to the LAST user message above. Return JSON only.`,
      model: "gpt_5_4",
      response_json_schema: {
        type: "object",
        properties: {
          reply: { type: "string" },
          isComplete: { type: "boolean" },
          field_comparison: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                description: { type: "string" },
                daily_tasks: { type: "string" },
                job_titles: { type: "array", items: { type: "string" } },
                skills: { type: "array", items: { type: "string" } },
                tools: { type: "array", items: { type: "string" } },
                example_projects: { type: "array", items: { type: "string" } },
                difficulty: { type: "string" },
                growth_opportunities: { type: "string" },
                personality_fit: { type: "string" },
                pros: { type: "array", items: { type: "string" } },
                cons: { type: "array", items: { type: "string" } },
                why_fits: { type: "string" }
              }
            }
          },
          profile: {
            type: "object",
            additionalProperties: true,
            properties: {
              goal: { type: "string" },
              current_level: { type: "string" },
              learning_style: { type: "string" },
              preferred_language: { type: "string" },
              depth: { type: "string" },
              weekly_hours: { type: "number" },
              available_days: { type: "array", items: { type: "string" } },
              preferred_time: { type: "string" },
              motivation: { type: "string" },
              stop_triggers: { type: "string" },
              encouragement: { type: "string" },
              strengths: { type: "string" },
              weaknesses: { type: "string" },
              emotional_state: { type: "string" },
              personality_traits: { type: "string" },
              current_challenges: { type: "string" },
              session_length: { type: "number" },
              career_intent: { type: "string" },
              deadline: { type: "string" },
              education: { type: "string" },
              current_role: { type: "string" },
              experience: { type: "string" },
              background: { type: "string" },
              budget: { type: "string" },
              device: { type: "string" },
              internet: { type: "string" }
            }
          }
        },
        required: ["reply", "isComplete"]
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
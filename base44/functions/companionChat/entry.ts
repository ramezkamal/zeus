import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ZEUS_SYSTEM } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const profile = body.profile || {};
    const roadmap = body.roadmap || null;
    const currentTask = body.currentTask || null;
    const companionName = body.companionName || "Zeus Companion";
    const lang = body.lang || profile.preferred_language || "ar";

    const context = `User Learning DNA: ${JSON.stringify(profile)}
Current roadmap goal: ${roadmap?.goal || "N/A"}
Current roadmap node: ${currentTask?.node_title || "N/A"}
Current task: ${currentTask?.title || "N/A"}
The AI companion's name is "${companionName}".`;

    const transcript = messages.map(m => `${m.role === "user" ? "User" : companionName}: ${m.content}`).join("\n\n");

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${ZEUS_SYSTEM}\n\n${context}\n\n=== CONVERSATION SO FAR ===\n${transcript}\n\n=== YOUR TURN ===\nRespond to the LAST user message above. The user may ask simply or vaguely — infer what they mean from the conversation, their Learning DNA, and the current roadmap node/task, then answer helpfully and decisively. Do NOT ask them to rephrase or clarify when you can reasonably guess. If they refer to "this part / الجزء ده / المشكلة دي", infer it from the current roadmap node/task above. Reply DIRECTLY — no reintroducing yourself, no greetings, no repeating the user's question. Be concise (1-3 sentences) but insightful. Reply in ${lang === "en" ? "English" : "Egyptian Arabic"}.`,
      model: "gpt_5_mini",
      response_json_schema: {
        type: "object",
        properties: {
          reply: { type: "string" }
        },
        required: ["reply"]
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
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

    const convo = messages.map(m => ({ role: m.role, content: m.content }));

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${ZEUS_SYSTEM}\n\n${context}\n\nContinue the conversation. Reply DIRECTLY to what the user just said — do NOT reintroduce yourself, greet, or say your name. Be concise (1-3 sentences). If the user refers to "this part / الجزء ده", infer it from the current roadmap node/task above. Reply in ${lang === "en" ? "English" : "Egyptian Arabic"}.`,
      model: "automatic",
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
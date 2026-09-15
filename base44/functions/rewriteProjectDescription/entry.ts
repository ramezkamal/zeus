import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { ZEUS_SYSTEM } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const description = body.description || '';
    const lang = body.lang === 'en' ? 'en' : 'ar';

    const prompt = `${ZEUS_SYSTEM}

Rewrite this project description to be more polished and professional. Keep it truthful — do NOT invent features, technologies, or achievements that aren't mentioned. Just improve the clarity, structure, and language.

Original description: "${description}"

Return a rewritten description (2-4 sentences, professional tone, highlighting what the project does and key features).
Reply in ${lang === 'en' ? 'English' : 'Egyptian Arabic'}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gpt_5_mini',
      response_json_schema: {
        type: 'object',
        properties: {
          description: { type: 'string' }
        },
        required: ['description']
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
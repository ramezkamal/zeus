import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { ZEUS_SYSTEM } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const summary = body.summary || '';
    const cv = body.cv || {};
    const isAr = body.isAr !== false;

    const prompt = `${ZEUS_SYSTEM}

Rewrite this professional CV summary to be more polished and impactful. Keep it truthful — do NOT invent experience, skills, or achievements that aren't mentioned. Just improve the language and structure.

Original summary: "${summary}"
CV context: role=${cv.title_role || ''}, skills=${JSON.stringify(cv.skills || []).slice(0, 200)}

Return a rewritten summary (2-4 sentences, professional tone, highlighting key strengths and goals).
Reply in ${isAr ? 'Egyptian Arabic' : 'English'}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gpt_5_mini',
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' }
        },
        required: ['summary']
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
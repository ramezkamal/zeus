import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { ZEUS_SYSTEM } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const profile = body.profile || {};
    const cv = body.cv || {};
    const lang = body.lang === 'en' ? 'en' : 'ar';

    const prompt = `${ZEUS_SYSTEM}

You are searching for REAL, CURRENT job opportunities for this user. Use web search to find actual job postings.

USER PROFILE:
- Goal: ${profile.goal || 'Not specified'}
- Current level: ${profile.current_level || 'beginner'}
- Skills: ${JSON.stringify(profile.skill_graph || [])}
- Career intent: ${profile.career_intent || 'Not specified'}
- Location: ${cv.location || 'Egypt'}
- Experience: ${profile.experience || 'Not specified'}

CV Summary: ${cv.summary || 'Not available'}

Find 5 real, current job opportunities that match this user's profile. For each job:
- title: job title
- company: company name
- location: job location
- description: short description (1-2 sentences)
- match_score: how well it matches (0-100)
- required_skills: top required skills
- missing_skills: skills the user is missing
- apply_url: URL to apply (real URL if found)

Search on platforms like LinkedIn, Wuzzuf, Indeed, Glassdoor.
Reply in ${lang === 'en' ? 'English' : 'Egyptian Arabic'}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'gemini_3_flash',
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          jobs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                company: { type: 'string' },
                location: { type: 'string' },
                description: { type: 'string' },
                match_score: { type: 'number' },
                required_skills: { type: 'array', items: { type: 'string' } },
                missing_skills: { type: 'array', items: { type: 'string' } },
                apply_url: { type: 'string' }
              },
              required: ['title', 'company', 'description', 'match_score']
            }
          }
        },
        required: ['jobs']
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
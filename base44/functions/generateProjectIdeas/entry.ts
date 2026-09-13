import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { ZEUS_SYSTEM } from "../../shared/zeusPrompts.js";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const profile = body.profile || {};
    const lang = body.lang === 'en' ? 'en' : 'ar';

    const prompt = `${ZEUS_SYSTEM}

You are a senior technical mentor. Generate 4 practical project ideas for this learner.

LEARNER:
- Goal: ${profile.goal || 'Not specified'}
- Level: ${profile.current_level || 'beginner'}
- Skills: ${JSON.stringify(profile.skill_graph || [])}
- Career intent: ${profile.career_intent || 'Not specified'}

RULES:
- Projects must be REAL-WORLD, portfolio-worthy, and match the learner's level
- Each project should solve a genuine problem (not a toy exercise)
- Difficulty should escalate: first project easiest, last most advanced
- Technologies should match the goal's ecosystem
- Each project must be buildable in 1-2 weeks at the learner's level

For each project return:
- title: concise project name
- problem: the real-world problem it solves (1-2 sentences)
- description: what the project does and key features
- requirements: array of functional requirements (what it must do)
- technologies: array of tools/languages/frameworks
- milestones: array of 3-5 build steps
- difficulty: "beginner" | "intermediate" | "advanced"
- skills_practiced: array of skills this project reinforces
- portfolio_value: what this project demonstrates to employers (1 sentence)

Reply in ${lang === 'en' ? 'English' : 'Egyptian Arabic'}.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude-sonnet-5',
      response_json_schema: {
        type: 'object',
        properties: {
          ideas: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                problem: { type: 'string' },
                description: { type: 'string' },
                requirements: { type: 'array', items: { type: 'string' } },
                technologies: { type: 'array', items: { type: 'string' } },
                milestones: { type: 'array', items: { type: 'string' } },
                difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                skills_practiced: { type: 'array', items: { type: 'string' } },
                portfolio_value: { type: 'string' }
              },
              required: ['title', 'description', 'difficulty']
            }
          }
        },
        required: ['ideas']
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
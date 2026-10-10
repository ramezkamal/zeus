// Ecosystem data for the landing marquee.
// IMPORTANT: these are TARGET organizations and technologies ZEUS builds with or aims to work with.
// None is presented as an official partner. When a partnership is confirmed, set `verified: true`.
const fav = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const PARTNER_GROUPS = [
  {
    key: "technology",
    label: "Technology Ecosystem",
    items: [
      { name: "Google Gemini", domain: "gemini.google.com", url: "https://gemini.google.com" },
      { name: "OpenAI", domain: "openai.com", url: "https://openai.com" },
      { name: "Anthropic", domain: "anthropic.com", url: "https://www.anthropic.com" },
      { name: "NVIDIA", domain: "nvidia.com", url: "https://www.nvidia.com" },
      { name: "xAI Grok", domain: "x.ai", url: "https://x.ai" },
      { name: "Microsoft Azure", domain: "azure.microsoft.com", url: "https://azure.microsoft.com" },
      { name: "AWS", domain: "aws.amazon.com", url: "https://aws.amazon.com" },
      { name: "GitHub", domain: "github.com", url: "https://github.com" }
    ]
  },
  {
    key: "training",
    label: "Education & Corporate Training",
    items: [
      { name: "Ministry of Communications & IT (MCIT)", domain: "mcit.gov.eg", url: "https://mcit.gov.eg" },
      { name: "Ministry of Higher Education", domain: "mohesr.gov.eg", url: "https://mohesr.gov.eg" },
      { name: "Ministry of Education", domain: "moe.gov.eg", url: "https://moe.gov.eg" },
      { name: "ITIDA", domain: "itida.gov.eg", url: "https://itida.gov.eg" },
      { name: "ITI", domain: "iti.gov.eg", url: "https://iti.gov.eg" },
      { name: "Digital Egypt Pioneers", domain: "depi.gov.eg", url: "https://depi.gov.eg" }
    ]
  },
  {
    key: "industry",
    label: "Employment & Industry",
    items: [
      { name: "LinkedIn", domain: "linkedin.com", url: "https://www.linkedin.com" },
      { name: "Wuzzuf", domain: "wuzzuf.net", url: "https://wuzzuf.net" },
      { name: "Forasna", domain: "forasna.com", url: "https://forasna.com" },
      { name: "Bayt", domain: "bayt.com", url: "https://www.bayt.com" },
      { name: "Indeed", domain: "indeed.com", url: "https://www.indeed.com" },
      { name: "Glassdoor", domain: "glassdoor.com", url: "https://www.glassdoor.com" },
      { name: "Naukrigulf", domain: "naukrigulf.com", url: "https://www.naukrigulf.com" },
      { name: "Akhtaboot", domain: "akhtaboot.com", url: "https://www.akhtaboot.com" }
    ]
  }
].map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, logo: fav(i.domain), verified: false })) }));
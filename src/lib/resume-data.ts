export const profile = {
  name: "Zach Bar",
  role: "Software Engineer",
  tagline: "Co-founder building AI-native products. Currently training the models that will train the next generation of software.",
  location: "Sherman Oaks, CA",
  email: "zachbar26@gmail.com",
  phone: "(818) 300-5533",
  availability: "Available 20-40 hrs/week",
  education: {
    school: "California State University, Northridge",
    degree: "B.S., Computer Science",
    timeframe: "Expected Spring 2027",
  },
};

export type Role = {
  id: string;
  company: string;
  companyUrl?: string;
  title: string;
  timeframe: string;
  location?: string;
  summary: string;
  highlights: string[];
};

// Chronological order (oldest first) so the timeline reads as a growth arc.
export const roles: Role[] = [
  {
    id: "code-ninjas",
    company: "Code Ninjas",
    title: "Instructor",
    timeframe: "2022 - 2025",
    location: "Encino & Studio City, CA",
    summary:
      "Where it started. Three years teaching kids and teens to think in code.",
    highlights: [
      "Taught coding fundamentals to children and teens for over three years, covering block-based programming, JavaScript, and game development concepts.",
      "Guided students through project-based learning, building problem-solving skills and computational thinking through hands-on coding challenges.",
    ],
  },
  {
    id: "python-tutor",
    company: "Independent",
    title: "Private Python Programming Tutor",
    timeframe: "Present",
    location: "Sherman Oaks, CA",
    summary: "One-on-one instruction, from first script to first system.",
    highlights: [
      "Provide one-on-one Python instruction to private clients, covering fundamentals through intermediate concepts including data structures, automation, and scripting.",
    ],
  },
  {
    id: "freelance-marketing",
    company: "Independent",
    title: "Freelance Digital Marketing Consultant",
    timeframe: "October 2025 - Present",
    location: "Sherman Oaks, CA",
    summary: "Where marketing and code started to overlap.",
    highlights: [
      "Managed Facebook Ads campaigns for two clients, handling creative strategy, audience targeting, and performance optimization to drive leads and conversions.",
      "Delivered comprehensive search visibility services including SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization) to improve rankings across traditional and AI-powered search surfaces.",
    ],
  },
  {
    id: "you-and-i",
    company: "You and I Recreational Services",
    title: "Technology Consultant & Programming Instructor",
    timeframe: "January 2026 - Present",
    location: "Tarzana, CA · Part-Time",
    summary: "Building for people the industry usually forgets.",
    highlights: [
      "Maintain and update the organization's WordPress website, implementing design and content improvements.",
      "Tutor special education students in foundational programming concepts using block-based coding tools and Lego robotics kits.",
    ],
  },
  {
    id: "magnet-ai",
    company: "Magnet AI",
    companyUrl: "https://gomagnet.ai",
    title: "Co-Founder",
    timeframe: "May 2026 - Present",
    location: "gomagnet.ai",
    summary:
      "Co-founded an AI-native marketing platform that automates Meta Ads campaign creation, audience targeting, and budget optimization for small businesses.",
    highlights: [
      "Architected and shipped a competitor intelligence tool that scrapes the Meta Ads Library to surface rival creatives and targeting strategies in real time.",
      "Built an autonomous autopilot agent using a JSON ReAct loop that monitors campaign performance and takes budget and bidding actions with user approval gates.",
      "Developed a remote MCP server enabling direct integration with Claude and ChatGPT, exposing five stateless marketing tools to AI assistants.",
      "Led full-stack development in Next.js, deployed on Render; managed product roadmap and client relationships.",
    ],
  },
  {
    id: "handshake-ai",
    company: "Handshake AI",
    title: "AI Trainer",
    timeframe: "June 2026 - Present",
    summary: "Now training the models that write and review code.",
    highlights: [
      "iOS Specialty: Trained AI models to navigate, interpret, and operate applications within the Apple ecosystem, evaluating model behavior across native iOS environments.",
      "Codex Training: Reviewed, critiqued, and revised AI-generated code responses from OpenAI Codex, improving output accuracy, code quality, and adherence to best practices.",
    ],
  },
];

export type SkillGroup = { label: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  { label: "Languages", skills: ["Python", "JavaScript", "TypeScript", "HTML/CSS"] },
  { label: "Frameworks", skills: ["Next.js", "React"] },
  {
    label: "AI & APIs",
    skills: [
      "OpenAI API",
      "Anthropic Claude API",
      "Meta Ads API",
      "MCP Protocol",
      "OpenAI Codex",
    ],
  },
  { label: "Tools & Platforms", skills: ["WordPress", "Git", "Render", "iOS Ecosystem"] },
  {
    label: "Other",
    skills: [
      "AI Agent Development",
      "Digital Advertising",
      "Technical Tutoring",
      "Block Programming",
    ],
  },
];

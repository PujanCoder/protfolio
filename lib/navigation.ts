export type NavItem = { href: string; label: string; description?: string };

export const engineerNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/architecture", label: "Architecture" },
  { href: "/playground", label: "Playground" },
  { href: "/quantum-lab", label: "Quantum" },
  { href: "/cybersecurity-lab", label: "Cyber" },
  { href: "/activity", label: "Activity" },
  { href: "/contact", label: "Contact" },
];

export const recruiterNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/recruiter", label: "Recruiter view" },
  { href: "/projects", label: "Projects" },
  { href: "/journey", label: "Journey" },
  { href: "/skills", label: "Skills" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
];

export const footerGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Profile",
    items: [
      { href: "/about", label: "About" },
      { href: "/journey", label: "Journey" },
      { href: "/skills", label: "Skills" },
      { href: "/education", label: "Education" },
      { href: "/achievements", label: "Achievements" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Engineering",
    items: [
      { href: "/projects", label: "Case studies" },
      { href: "/architecture", label: "Architecture explorer" },
      { href: "/compare", label: "Compare projects" },
      { href: "/playground", label: "Playground" },
      { href: "/cybersecurity-lab", label: "Cybersecurity lab" },
      { href: "/quantum-lab", label: "Quantum lab" },
      { href: "/activity", label: "GitHub activity" },
    ],
  },
  {
    title: "Hiring",
    items: [
      { href: "/recruiter", label: "Recruiter view" },
      { href: "/assistant", label: "Ask Pujan AI" },
      { href: "/research", label: "Research notes" },
      { href: "/blog", label: "Blog" },
    ],
  },
];

/** Every indexable route, used by the command palette and site search. */
export const allRoutes: NavItem[] = [
  { href: "/", label: "Home", description: "Introduction and featured work" },
  { href: "/recruiter", label: "Recruiter view", description: "Summary, strengths and downloadable CVs" },
  { href: "/about", label: "About", description: "Background, principles and how I work" },
  { href: "/projects", label: "Projects", description: "Six engineering case studies" },
  { href: "/architecture", label: "Architecture explorer", description: "Clickable system diagrams" },
  { href: "/compare", label: "Compare projects", description: "Side-by-side engineering comparison" },
  { href: "/playground", label: "Playground", description: "Machine learning, NLP and data science demos" },
  { href: "/cybersecurity-lab", label: "Cybersecurity lab", description: "Network intrusion detection demonstration" },
  { href: "/quantum-lab", label: "Quantum lab", description: "Statevector simulator, Bloch sphere, Qiskit" },
  { href: "/labs", label: "Interactive labs", description: "Thresholds, gates and tokenizers" },
  { href: "/labs/network-intrusion-detection", label: "NDR operating point lab", description: "Threshold trade-offs" },
  { href: "/labs/medical-imaging-mlops", label: "Medical retrain gate lab", description: "Quality gate arithmetic" },
  { href: "/labs/gpt2-clone", label: "BPE tokenizer lab", description: "Byte-level merges in the browser" },
  { href: "/assistant", label: "Ask Pujan AI", description: "Grounded assistant" },
  { href: "/activity", label: "GitHub activity", description: "Live repository and commit data" },
  { href: "/journey", label: "Journey", description: "Timeline of verified milestones" },
  { href: "/achievements", label: "Achievements", description: "Qiskit Advocate, hackathons, leadership" },
  { href: "/skills", label: "Skills", description: "Verified stack with evidence" },
  { href: "/education", label: "Education", description: "Academic record and self-directed study" },
  { href: "/research", label: "Research notes", description: "Experiments and engineering investigations" },
  { href: "/blog", label: "Blog", description: "Walkthroughs and lessons learned" },
  { href: "/contact", label: "Contact", description: "Email, GitHub and collaboration" },
];

export const routeCount = allRoutes.length;

export type AchievementCategory =
  | "Quantum"
  | "Hackathon"
  | "Leadership"
  | "Recognition";

export type Achievement = {
  slug: string;
  title: string;
  org: string;
  period?: string;
  category: AchievementCategory;
  badge?: string;
  summary: string;
  detail: string[];
  evidence: { label: string; href?: string }[];
  featured: boolean;
  order: number;
};

const repo = (name: string) => `https://github.com/PujanCoder/${name}`;

// Content note: every entry below comes from Pujan's own account of his record or
// from public repositories. Entries marked "verify" still need a verifiable
// link (certificate, event page, or organiser announcement) before they can be
// presented as externally confirmed.
export const achievements: Achievement[] = [
  {
    slug: "qiskit-advocate",
    title: "IBM Quantum Qiskit Advocate",
    org: "IBM Quantum",
    period: "Current",
    category: "Quantum",
    badge: "Advocate",
    summary:
      "Part of the IBM Quantum Qiskit Advocate community, recognised for sustained work with the Qiskit SDK and quantum computing exploration.",
    detail: [
      "Implemented core quantum algorithms in Qiskit: Shor's algorithm, Grover's search, quantum phase estimation, teleportation, superdense coding and the double-slit experiment.",
      "Built quantum machine-learning experiments using quantum support vector machine kernels for breast-cancer classification and card-fraud detection.",
      "Keeps each experiment public and reproducible in Python and Jupyter so the circuits can be read, run and challenged.",
    ],
    evidence: [
      { label: "Shor's algorithm", href: repo("Shor-s-Algorithm") },
      { label: "Grover's search", href: repo("Grover_Algorithm") },
      { label: "Quantum phase estimation", href: repo("Quantum_Phase_Estimation") },
      { label: "QSVM — breast cancer", href: repo("Breast_Cancer-Prediction-using-Quantum-Machine-Learning-QSVM-") },
      { label: "QML — card fraud", href: repo("Credit-Card-Fraud-Detection-using-Quantum-Machine-Learning") },
    ],
    // verify: add the public Qiskit Advocate directory entry once it is linkable.
    featured: true,
    order: 1,
  },
  {
    slug: "national-hackathon-third-place",
    title: "National hackathon — 3rd place",
    org: "National-level hackathon",
    category: "Hackathon",
    badge: "3rd place",
    summary:
      "Placed third as part of a team in a national-level hackathon, building and pitching a working prototype inside the event window.",
    detail: [
      "Worked in a team under a fixed deadline, from problem scoping through to a demo.",
      "Shared the result with judges and the wider event audience as a team placement.",
    ],
    // verify: event name, organiser, date and project repository.
    evidence: [],
    featured: true,
    order: 2,
  },
  {
    slug: "nepathon",
    title: "Nepathon hackathon",
    org: "Nepathon",
    category: "Hackathon",
    badge: "Participation",
    summary:
      "Took part in Nepathon, a Nepal-focused hackathon, building with a team on a compressed schedule.",
    detail: [
      "Contributed to a team build during the event and worked through the full prototype cycle.",
    ],
    // verify: confirm placement and add the event or project link before
    // presenting this as a result rather than participation.
    evidence: [],
    featured: false,
    order: 3,
  },
  {
    slug: "district-hackathon",
    title: "District-level hackathon",
    org: "District hackathon",
    category: "Hackathon",
    badge: "Participation",
    summary:
      "Took part in district-level hackathon activity alongside school technical work, building in a team against the clock.",
    detail: [],
    evidence: [],
    featured: false,
    order: 4,
  },
  {
    slug: "it-club-secretary",
    title: "Secretary, IT Club",
    org: "IT Club",
    category: "Leadership",
    badge: "Leadership",
    summary:
      "Served as secretary of the IT club, coordinating technical activities, coding sessions and events for other students.",
    detail: [
      "Helped organise coding programmes and technical events.",
      "Handled coordination and record-keeping for club activities.",
    ],
    // verify: school name and years served.
    evidence: [],
    featured: true,
    order: 5,
  },
  {
    slug: "child-club-president",
    title: "President, Child Club (Tole)",
    org: "Community child club",
    category: "Leadership",
    badge: "Leadership",
    summary:
      "Led a local child club, organising community activities and representing the group.",
    detail: [
      "Coordinated club activities and represented the group in the local community.",
    ],
    evidence: [],
    featured: false,
    order: 6,
  },
];

export const featuredAchievements = achievements.filter((item) => item.featured);

export const achievementTimeline = [
  {
    year: "2024",
    title: "First public repositories",
    body: "Started publishing coursework and early machine-learning projects on GitHub — symptom checkers, forest-cover classification and price predictors served behind Flask and Streamlit.",
  },
  {
    year: "2025",
    title: "Quantum computing with Qiskit",
    body: "Moved from textbook quantum mechanics to circuits: Shor's algorithm, Grover's search, phase estimation, teleportation and quantum machine-learning kernels, all implemented and published.",
  },
  {
    year: "2025",
    title: "Leadership and hackathons",
    body: "Served as IT Club secretary, led a community child club, and competed in district and national hackathon teams.",
  },
  {
    year: "2026",
    title: "Production machine learning",
    body: "Built the NDR platform, the medical-imaging MLOps pipeline, a GPT-2 clone from scratch, and LLM agent systems — with tests, CI and documented limitations.",
  },
];

export const hackathons = achievements.filter(
  (item) => item.category === "Hackathon",
);

export type JourneyCategory =
  | "Education"
  | "Leadership"
  | "Hackathon"
  | "Recognition"
  | "Engineering"
  | "Quantum";

export type JourneyEntry = {
  id: string;
  title: string;
  org: string;
  period: string;
  year: number | null;
  category: JourneyCategory;
  summary: string;
  detail: string[];
  links?: { label: string; href: string }[];
};

const repo = (name: string) => `https://github.com/PujanCoder/${name}`;

export const journeyEntries: JourneyEntry[] = [
  {
    id: "class-10",
    title: "Secondary education",
    org: "Everest English Boarding School",
    period: "Completed",
    year: null,
    category: "Education",
    summary: "Finished secondary schooling in Nepal.",
    detail: [
      "Where the first serious exposure to computing happened, well before any of the repositories here existed.",
    ],
  },
  {
    id: "class-12",
    title: "Class 12 — Computer Science",
    org: "Higher secondary",
    period: "Completed",
    year: null,
    category: "Education",
    summary: "Higher secondary study in computer science.",
    detail: [
      "Coursework turned into building software outside the syllabus: the first classifiers, then the first deployed apps.",
    ],
  },
  {
    id: "child-club",
    title: "President, Child Club (Tole)",
    org: "Community child club",
    period: "Earlier leadership",
    year: null,
    category: "Leadership",
    summary: "Led a local child club and represented the group in the community.",
    detail: ["Coordinated club activities and represented the group locally."],
  },
  {
    id: "it-club",
    title: "Secretary, IT Club",
    org: "IT Club",
    period: "School years",
    year: null,
    category: "Leadership",
    summary: "Coordinated technical activities, coding sessions and events for other students.",
    detail: [
      "Helped organise coding programmes and technical events.",
      "Handled coordination and record-keeping for club activities.",
    ],
  },
  {
    id: "district-hackathon",
    title: "District-level hackathon",
    org: "District hackathon",
    period: "Participation",
    year: null,
    category: "Hackathon",
    summary: "Built in a team against the clock alongside school technical work.",
    detail: ["Full prototype cycle inside the event window."],
  },
  {
    id: "nepathon",
    title: "Nepathon hackathon",
    org: "Nepathon",
    period: "Participation",
    year: null,
    category: "Hackathon",
    summary: "Took part in a Nepal-focused hackathon with a team on a compressed schedule.",
    detail: ["Contributed to a team build through the full prototype cycle."],
  },
  {
    id: "national-hackathon",
    title: "National hackathon — 3rd place",
    org: "National-level hackathon",
    period: "Team placement",
    year: null,
    category: "Hackathon",
    summary: "Placed third as part of a team, building and pitching a working prototype inside the event window.",
    detail: [
      "Worked in a team under a fixed deadline, from problem scoping through to a demo.",
      "Presented the result to judges and the wider event audience.",
    ],
  },
  {
    id: "first-repos",
    title: "First public repositories",
    org: "GitHub",
    period: "2024",
    year: 2024,
    category: "Engineering",
    summary:
      "Started publishing coursework and early machine-learning projects: symptom checkers, forest-cover classification and price predictors behind Flask and Streamlit.",
    detail: [
      "The habit that stuck: publish the thing, not a description of the thing.",
    ],
    links: [{ label: "GitHub profile", href: "https://github.com/PujanCoder" }],
  },
  {
    id: "qiskit",
    title: "Quantum computing with Qiskit",
    org: "IBM Quantum / Qiskit",
    period: "2025",
    year: 2025,
    category: "Quantum",
    summary:
      "Moved from textbook quantum mechanics to circuits: Shor's algorithm, Grover's search, phase estimation, teleportation and quantum machine-learning kernels, all implemented and published.",
    detail: [
      "Each experiment is a runnable notebook, not a summary.",
      "Later recognised as part of the IBM Quantum Qiskit Advocate community.",
    ],
    links: [
      { label: "Shor's algorithm", href: repo("Shor-s-Algorithm") },
      { label: "Grover's search", href: repo("Grover_Algorithm") },
      { label: "QSVM — breast cancer", href: repo("Breast_Cancer-Prediction-using-Quantum-Machine-Learning-QSVM-") },
    ],
  },
  {
    id: "leadership-hackathons",
    title: "Leadership and hackathons",
    org: "IT Club · community · events",
    period: "2025",
    year: 2025,
    category: "Leadership",
    summary:
      "Served as IT Club secretary, led a community child club, and competed in district and national hackathon teams.",
    detail: ["Third place at a national-level hackathon as part of a team."],
  },
  {
    id: "production-ml",
    title: "Production machine learning",
    org: "NDR platform · medical MLOps · GPT-2 clone",
    period: "2026",
    year: 2026,
    category: "Engineering",
    summary:
      "Built the NDR platform, the medical-imaging MLOps pipeline, a GPT-2 clone from scratch, and LLM agent systems — with tests, CI and documented limitations.",
    detail: [
      "The NDR platform reports 0.973 F1 on 44,734 held-out flows and publishes a zero-recall cross-dataset probe next to it.",
      "The medical pipeline rejected its own retrain on 0.236 tuberculosis recall.",
      "The GPT-2 clone ships the real 50,257-token vocabulary and six pytest modules.",
    ],
    links: [
      { label: "NDR platform", href: repo("Network-Intrusion-Detection-Advanced-MLOps") },
      { label: "Medical MLOps", href: repo("Medical-imaging-MLOps") },
      { label: "GPT-2 clone", href: repo("GPT-2-CLONE") },
    ],
  },
  {
    id: "qiskit-advocate",
    title: "IBM Quantum Qiskit Advocate",
    org: "IBM Quantum",
    period: "Current",
    year: null,
    category: "Recognition",
    summary:
      "Part of the IBM Quantum Qiskit Advocate community, recognised for sustained work with the Qiskit SDK.",
    detail: [
      "Recognition is community-based; the public evidence is the Qiskit work itself, every repository linked from the quantum lab.",
    ],
    links: [{ label: "Quantum lab", href: "/quantum-lab/" }],
  },
];

export const journeyCategories: JourneyCategory[] = [
  "Engineering",
  "Quantum",
  "Recognition",
  "Hackathon",
  "Leadership",
  "Education",
];

export const journeyYears = Array.from(
  new Set(journeyEntries.map((entry) => entry.year).filter((year): year is number => year !== null)),
).sort((a, b) => a - b);

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Atom, BookOpen, Cpu, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Badge, CTASection, PageHero, SectionHeader } from "@/components/ui";
import { GateExplorer } from "@/components/quantum/gate-explorer";
import { EntanglementDemo, SuperpositionDemo } from "@/components/quantum/demos";
import { NoisePanel } from "@/components/quantum/noise-panel";
import { achievements } from "@/lib/achievements";

export const metadata: Metadata = {
  title: "Quantum Computing Lab",
  description:
    "An interactive quantum computing lab: exact statevector simulation, a Bloch sphere, gate explorer, superposition and entanglement demonstrations, and Qiskit experiments.",
  alternates: { canonical: "/quantum-lab/" },
  openGraph: {
    title: "Quantum Computing Lab — Pujan Pandey",
    description:
      "Build circuits, watch the Bloch vector move, and read the Qiskit equivalent. Educational simulation, no hardware execution.",
    url: "/quantum-lab/",
  },
};

const qiskit = achievements.find((item) => item.slug === "qiskit-advocate")!;

const experiments = [
  {
    title: "Shor's algorithm",
    repo: "Shor-s-Algorithm",
    note: "Integer factorisation reduced to period finding with the quantum Fourier transform.",
  },
  {
    title: "Grover's search",
    repo: "Grover_Algorithm",
    note: "Amplitude amplification: quadratic speedup over unstructured search.",
  },
  {
    title: "Quantum phase estimation",
    repo: "Quantum_Phase_Estimation",
    note: "The subroutine underneath Shor, chemistry and eigenvalue estimation.",
  },
  {
    title: "Quantum teleportation",
    repo: "Quantum-Teleportation",
    note: "Moving a state with one Bell pair and two classical bits.",
  },
  {
    title: "Superdense coding",
    repo: "Superdense-Coding",
    note: "The reverse trick: two classical bits through a single qubit.",
  },
  {
    title: "Double-slit experiment",
    repo: "Double_Slit_Experiment",
    note: "Interference built gate by gate, with and without an observer.",
  },
  {
    title: "QSVM — breast cancer",
    repo: "Breast_Cancer-Prediction-using-Quantum-Machine-Learning-QSVM-",
    note: "Quantum kernel classification on a biomedical dataset, compared with classical baselines.",
  },
  {
    title: "QML — card fraud",
    repo: "Credit-Card-Fraud-Detection-using-Quantum-Machine-Learning",
    note: "QSVC and variational circuits against classical models on imbalanced fraud data.",
  },
  {
    title: "Quantum chemistry simulation",
    repo: "Quantum-Chemistry-Simulation-",
    note: "Molecular energies from qubit Hamiltonians and expectation values.",
  },
];

export default function QuantumPage() {
  return (
    <>
      <PageHero
        eyebrow="Quantum computing lab"
        title="Quantum mechanics you can actually poke at."
        description="An exact statevector simulator running in your browser: build a circuit, watch the reduced Bloch vector move, and read the Qiskit equivalent line by line. Every number below comes from the linear algebra, not from a screenshot."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <Atom className="h-3 w-3" />
            Qiskit Advocate
          </Badge>
          <Badge tone="neutral">
            <Cpu className="h-3 w-3" />
            Educational simulation
          </Badge>
          <Badge tone="amber">
            <ShieldAlert className="h-3 w-3" />
            No IBM hardware execution
          </Badge>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white">
        <div className="container-page grid gap-6 py-12 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-12">
          <div>
            <p className="mono-label">Verified recognition</p>
            <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)] leading-tight">
              IBM Quantum Qiskit Advocate
            </h2>
            <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-quiet">
              {qiskit.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {qiskit.evidence.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-soft transition-colors hover:border-forest/30 hover:text-forest"
                >
                  {item.label}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-quiet">
              The advocate programme is a community recognition from IBM Quantum. The public
              evidence here is the Qiskit work itself: every experiment below is a repository you
              can open and run.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-canvas-soft/60 p-5">
            <p className="mono-label">How this lab computes</p>
            <ul className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-ink-soft">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                State is a complex vector of length 2ⁿ, evolved by exact 2×2 matrix multiplication.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                The Bloch vector is the partial trace of the register, so entangled qubits correctly
                show a shortened arrow.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                Measurement samples the Born probabilities. There is no noise model, so real
                hardware counts will differ.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-page py-14 md:py-16">
          <Reveal>
            <SectionHeader
              eyebrow="Interactive"
              title="Gate explorer"
              description="Add gates, change the qubit count, and watch the state evolve. Remove a gate by clicking it in the circuit."
            />
          </Reveal>
          <div className="mt-8">
            <GateExplorer />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page py-14 md:py-16">
          <Reveal>
            <SectionHeader
              eyebrow="Two phenomena"
              title="Superposition and entanglement, measured"
              description="The two ideas that make quantum computing different, shown as statistics rather than adjectives."
            />
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Reveal delay={0.05}>
              <SuperpositionDemo />
            </Reveal>
            <Reveal delay={0.1}>
              <EntanglementDemo />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-page py-14 md:py-16">
          <Reveal>
            <SectionHeader
              eyebrow="Noise"
              title="Exact amplitudes are the easy part."
              description="A statevector simulator has no error model. Move the slider to see what a depolarising channel does to the same Bell pair: fidelity falls, off-diagonal terms decay, and the measurement distribution flattens toward uniform."
            />
          </Reveal>
          <div className="mt-8">
            <NoisePanel />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-page py-14 md:py-16">
          <Reveal>
            <SectionHeader
              eyebrow="Public work"
              title="Qiskit experiments in the open"
              description="Nine repositories, each one a runnable notebook rather than a claim. Open any of them and read the circuits."
              action={{ href: "https://github.com/PujanCoder?tab=repositories", label: "All repositories" }}
            />
          </Reveal>

          <div className="mt-8 grid gap-3 [&>*]:min-w-0 sm:grid-cols-2 lg:grid-cols-3">
            {experiments.map((experiment, index) => (
              <Reveal key={experiment.repo} delay={index * 0.02}>
                <a
                  href={`https://github.com/PujanCoder/${experiment.repo}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex h-full min-w-0 flex-col rounded-xl border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[0_8px_28px_-18px_rgba(6,78,59,0.45)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[13.5px] font-medium text-ink">{experiment.title}</h3>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-quiet transition-colors group-hover:text-forest" />
                  </div>
                  <p className="mt-1.5 flex-1 text-[11.5px] leading-relaxed text-quiet">
                    {experiment.note}
                  </p>
                  <p className="mt-3 truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-quiet/80">
                    {experiment.repo}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-canvas-soft/60">
        <div className="container-page grid gap-6 py-14 md:grid-cols-2 md:gap-10 md:py-16">
          <div>
            <p className="mono-label">Scope</p>
            <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)] leading-tight">
              What this lab is, and what it is not
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-quiet">
              Being explicit about the boundary is the difference between a demo and a claim.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="flex items-center gap-2 text-[12.5px] font-medium text-forest">
                <BookOpen className="h-3.5 w-3.5" />
                What it is
              </p>
              <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-ink-soft">
                <li>An exact simulator for 1–3 qubits, including phase-accurate amplitudes.</li>
                <li>A teaching surface for gates, circuits and measurement statistics.</li>
                <li>Qiskit code that reproduces the same circuit on Aer.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="flex items-center gap-2 text-[12.5px] font-medium text-amber-800">
                <ShieldAlert className="h-3.5 w-3.5" />
                What it is not
              </p>
              <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-ink-soft">
                <li>Not a run on IBM Quantum hardware, and not a noise or error-mitigation study.</li>
                <li>Not a quantum advantage claim: 3 qubits is a classroom, not a benchmark.</li>
                <li>Not a substitute for the notebooks, which run larger circuits on Aer and hardware.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Quantum curious, or building something adjacent?"
        description="I am happy to talk about Qiskit experiments, quantum machine learning, or where classical ML is still the right answer."
      />

      <div className="container-page py-8">
        <Link
          href="/projects"
          className="text-[12.5px] text-quiet transition-colors hover:text-forest"
        >
          ← Back to the project archive
        </Link>
      </div>
    </>
  );
}

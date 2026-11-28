import { retrieve, type KnowledgeEntry } from "./knowledge";

export type LocalAnswer = {
  text: string;
  /** Same vocabulary the server route used, so the UI label keeps working. */
  mode: "retrieval" | "empty";
  sources: { label: string; href: string }[];
};

/** Retrieval answer used when there is no server. Pure function, runs in the browser. */
export function answerLocally(question: string): LocalAnswer {
  const entries = retrieve(question, 2);

  if (entries.length === 0) {
    return {
      mode: "empty",
      sources: [],
      text:
        "I could not find that in Pujan's verified profile, and this assistant is not allowed to guess. The fastest way to get a real answer is email: pujanpandey012@gmail.com. You can also ask about the NDR platform, the medical imaging pipeline, the GPT-2 clone, quantum computing with Qiskit, or his skills.",
    };
  }

  const [primary, secondary] = entries;
  const parts = [primary.answer];
  if (secondary) parts.push("Related: " + secondary.answer);

  const links = entries.flatMap((entry: KnowledgeEntry) => entry.links ?? []);
  if (links.length > 0) {
    parts.push("Where to look: " + links.map((link) => link.label + " (" + link.href + ")").join(", ") + ".");
  }

  return { text: parts.join("\n\n"), mode: "retrieval", sources: links };
}

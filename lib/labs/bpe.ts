/**
 * A real, if small, byte-level byte-pair-encoding tokenizer.
 *
 * GPT-2 itself ships 50,257 merge operations learned over a large corpus. This
 * trains its own merge table over a short sample of technical English so the
 * mechanics — bytes first, most frequent pair merged first, reversible by
 * construction — can be inspected in the browser. Same algorithm, smaller
 * vocabulary.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const tokenBytes = (token: number[]) => token.join(",");
const same = (a: number[], b: number[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const splitWords = (text: string): string[] => text.match(/\s+|[A-Za-z]+|\d+|[^\sA-Za-z\d]+/g) ?? [];

const toSymbols = (word: string): number[][] =>
  Array.from(encoder.encode(word), (byte) => [byte]);

export function trainBpe(corpus: string, numMerges: number): number[][] {
  const words = splitWords(corpus).map(toSymbols);
  const merges: number[][] = [];

  for (let step = 0; step < numMerges; step += 1) {
    const counts = new Map<string, { left: number[]; right: number[]; count: number }>();

    for (const tokens of words) {
      for (let i = 0; i < tokens.length - 1; i += 1) {
        const key = `${tokenBytes(tokens[i])}|${tokenBytes(tokens[i + 1])}`;
        const entry = counts.get(key);
        if (entry) entry.count += 1;
        else counts.set(key, { left: tokens[i], right: tokens[i + 1], count: 1 });
      }
    }

    let best: { left: number[]; right: number[]; count: number } | null = null;
    for (const entry of counts.values()) {
      if (!best || entry.count > best.count) best = entry;
    }
    if (!best || best.count < 2) break;

    const merged = [...best.left, ...best.right];
    merges.push(merged);

    for (const tokens of words) {
      for (let i = 0; i < tokens.length - 1; i += 1) {
        if (same(tokens[i], best.left) && same(tokens[i + 1], best.right)) {
          tokens.splice(i, 2, merged);
          i -= 1;
        }
      }
    }
  }

  return merges;
}

export function encode(text: string, merges: number[][]): number[][] {
  return splitWords(text).flatMap((word) => {
    const tokens = toSymbols(word);
    for (const merge of merges) {
      if (tokens.length < 2) break;
      for (let i = 0; i < tokens.length - 1; i += 1) {
        const candidate = tokens.slice(i, i + 2);
        if (candidate[0].length + candidate[1].length === merge.length) {
          const joined = [...candidate[0], ...candidate[1]];
          if (same(joined, merge)) {
            tokens.splice(i, 2, joined);
            i -= 1;
          }
        }
      }
    }
    return tokens;
  });
}

export function decode(tokens: number[][]): string {
  return decoder.decode(Uint8Array.from(tokens.flat()));
}

export function tokenDisplay(token: number[]): string {
  const text = decoder.decode(Uint8Array.from(token));
  return text.replace(/ /g, "␣").replace(/\n/g, "⏎");
}

export const byteLength = (text: string) => encoder.encode(text).length;

export const CORPUS = `Machine learning systems fail in the seams between components. A model that scores well on a held-out split can still collapse on traffic it has never seen, and a dashboard that hides that failure is worse than no dashboard at all. The engineering work is the pipeline around the model: ingestion that survives restarts, a feature contract shared by training and serving, a registry that refuses to promote a regression, and monitoring that reports freshness and latency instead of inventing activity. Detection systems add their own constraint, because the cost of a false positive is an analyst's afternoon and the cost of a false negative is an incident. Medical imaging adds another, where recall on the positive class matters more than aggregate accuracy. Transformers add a third, where tokenisation decisions made before the model sees a single number shape everything downstream.`;

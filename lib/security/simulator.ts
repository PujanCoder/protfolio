import { ATTACK_BINS, BENIGN_BINS, binCenter, binStart, NDR_BINS } from "@/lib/labs/ndr";

/**
 * Synthetic event stream for the cybersecurity lab.
 *
 * Scores are drawn from the published score distributions of the NDR model,
 * and the labels follow the class each bin was drawn from. This is a
 * deterministic simulation of how the detector behaves — it is not captured
 * traffic, and the categories below are labels, not live attacks.
 */

export type AttackCategory = "DDoS" | "Port Scan" | "Brute Force" | "Botnet" | "Web Attack";

export type SimEvent = {
  id: number;
  uid: string;
  ts: number;
  src: string;
  dst: string;
  srcPort: number;
  dstPort: number;
  proto: string;
  service: string;
  duration: number;
  origBytes: number;
  respBytes: number;
  connState: string;
  score: number;
  label: "benign" | AttackCategory;
  rules: string[];
};

const CATEGORIES: AttackCategory[] = ["DDoS", "Port Scan", "Brute Force", "Botnet", "Web Attack"];
const SERVICES = ["http", "dns", "ssl", "ssh", "ftp", "smtp", "dhcp", "-"];
const STATES = ["SF", "S0", "REJ", "RSTO", "S1", "SH"];

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hex(random: () => number, length: number) {
  let out = "";
  const alphabet = "0123456789ABCDEF";
  for (let index = 0; index < length; index += 1) {
    out += alphabet[Math.floor(random() * alphabet.length)];
  }
  return out;
}

function drawScore(random: () => number, attack: boolean) {
  const bins = attack ? ATTACK_BINS : BENIGN_BINS;
  const total = bins.reduce((sum, value) => sum + value, 0);
  let roll = random() * total;
  let index = 0;
  for (; index < NDR_BINS; index += 1) {
    roll -= bins[index];
    if (roll <= 0) break;
  }
  const clamped = Math.min(index, NDR_BINS - 1);
  const width = binStart(clamped + 1) - binStart(clamped);
  const score = binCenter(clamped) + (random() - 0.5) * width;
  return Math.min(0.999, Math.max(0.001, score));
}

const RULES: Record<AttackCategory, string[]> = {
  DDoS: ["ddos.volumetric_flow", "conn.state_flood"],
  "Port Scan": ["scan.distinct_ports", "conn.reset_burst"],
  "Brute Force": ["auth.repeated_failures", "conn.short_duration_burst"],
  Botnet: ["beacon.periodic_interval", "dns.high_entropy_names"],
  "Web Attack": ["http.suspicious_payload", "conn.oversized_request"],
};

export function generateEvents(count = 60, seed = 424242): SimEvent[] {
  const random = mulberry32(seed);
  const events: SimEvent[] = [];
  const base = 1_767_225_600;

  for (let index = 0; index < count; index += 1) {
    const attack = random() < 0.47;
    const category = attack ? CATEGORIES[Math.floor(random() * CATEGORIES.length)] : null;
    const score = drawScore(random, attack);
    const burst = category === "DDoS" || category === "Port Scan";

    events.push({
      id: index,
      uid: `C${hex(random, 16)}`,
      ts: base + index * 7 + Math.floor(random() * 5),
      src: `192.168.${Math.floor(random() * 4)}.${Math.floor(random() * 254) + 1}`,
      dst: `10.0.${Math.floor(random() * 8)}.${Math.floor(random() * 254) + 1}`,
      srcPort: Math.floor(random() * 60000) + 1024,
      dstPort: burst ? 80 : [22, 53, 80, 443, 8080, 25][Math.floor(random() * 6)],
      proto: random() < 0.85 ? "tcp" : "udp",
      service: SERVICES[Math.floor(random() * SERVICES.length)],
      duration: Math.round((burst ? random() * 0.4 : random() * 8) * 1000) / 1000,
      origBytes: Math.round(burst ? random() * 900 : random() * 48_000),
      respBytes: Math.round(burst ? random() * 240 : random() * 320_000),
      connState: attack ? STATES[Math.floor(random() * 4)] : STATES[Math.floor(random() * 2)],
      score,
      label: category ?? "benign",
      rules: category ? RULES[category] : [],
    });
  }

  return events;
}

export const eventCategories = ["benign", ...CATEGORIES] as const;

export function alertTimeline(events: SimEvent[], buckets = 12) {
  const perBucket = Math.ceil(events.length / buckets);
  return Array.from({ length: buckets }, (_, index) => {
    const slice = events.slice(index * perBucket, (index + 1) * perBucket);
    return {
      bucket: index,
      attacks: slice.filter((event) => event.label !== "benign").length,
      benign: slice.filter((event) => event.label === "benign").length,
      rules: slice.reduce((total, event) => total + event.rules.length, 0),
    };
  });
}

export function scoreHistogram(events: SimEvent[], bins = 10) {
  const counts = new Array(bins).fill(0);
  for (const event of events) {
    const index = Math.min(bins - 1, Math.floor(event.score * bins));
    counts[index] += 1;
  }
  return counts;
}

export function categoryCounts(events: SimEvent[]) {
  const counts = new Map<string, number>();
  for (const event of events) {
    counts.set(event.label, (counts.get(event.label) ?? 0) + 1);
  }
  return counts;
}

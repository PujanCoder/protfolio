import type { CvDocument } from "@/lib/cv/content";

/**
 * Minimal PDF writer: enough of the format to lay out a text CV with no
 * dependencies. Helvetica metrics are used for wrapping, so what is measured
 * is what the viewer will render.
 */

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 52;
const CONTENT_W = PAGE_W - MARGIN * 2;

const FOREST = "0.024 0.306 0.231";
const EMERALD = "0.020 0.588 0.412";
const INK = "0.067 0.094 0.153";
const QUIET = "0.42 0.447 0.502";

const WIDTHS: Record<string, number> = {
  " ": 278, "!": 278, '"': 355, "#": 556, $: 556, "%": 889, "&": 667, "'": 191,
  "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333, ".": 278, "/": 278,
  "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556, "7": 556,
  "8": 556, "9": 556, ":": 278, ";": 278, "<": 584, "=": 584, ">": 584, "?": 556,
  "@": 1015, A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722,
  I: 278, J: 500, K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722,
  S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611, "[": 278,
  "\\": 278, "]": 278, "^": 469, _: 556, "`": 333, a: 556, b: 556, c: 500, d: 556,
  e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833, n: 556,
  o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500,
  y: 500, z: 500, "{": 334, "|": 260, "}": 334, "~": 584,
};

const REPLACEMENTS: [RegExp, string][] = [
  [/[—–]/g, "-"],
  [/[’‘]/g, "'"],
  [/[“”]/g, '"'],
  [/·/g, "-"],
  [/≥/g, ">="],
  [/≤/g, "<="],
  [/→/g, "->"],
  [/×/g, "x"],
  [/≈/g, "~"],
  [/ⁿ/g, "n"],
  [/²/g, "2"],
  [/³/g, "3"],
];

function ascii(text: string): string {
  let out = text;
  for (const [pattern, value] of REPLACEMENTS) {
    out = out.replace(pattern, value);
  }
  return out.replace(/[^\x20-\x7e]/g, "");
}

function widthOf(text: string, size: number, bold: boolean) {
  let total = 0;
  for (const char of text) total += WIDTHS[char] ?? 556;
  return (total / 1000) * size * (bold ? 1.05 : 1);
}

function wrap(text: string, size: number, bold: boolean, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (widthOf(candidate, size, bold) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function escapePdf(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

class Page {
  ops: string[] = [];
  y = PAGE_H - MARGIN;

  text(value: string, x: number, y: number, size: number, bold: boolean, color: string) {
    this.ops.push(
      `BT /${bold ? "F2" : "F1"} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escapePdf(
        ascii(value),
      )}) Tj ET`,
    );
  }

  rule(x: number, y: number, width: number, color: string, thickness = 0.6) {
    this.ops.push(
      `${color} RG ${thickness} w ${x.toFixed(2)} ${y.toFixed(2)} m ${(x + width).toFixed(2)} ${y.toFixed(
        2,
      )} l S`,
    );
  }
}

export function renderCv(doc: CvDocument): Buffer {
  const pages: Page[] = [];
  let page = new Page();
  pages.push(page);

  const ensure = (needed: number) => {
    if (page.y - needed < MARGIN + 24) {
      page = new Page();
      pages.push(page);
      page.text(`${doc.name} — ${doc.label}`, MARGIN, PAGE_H - MARGIN + 6, 7.5, false, QUIET);
      page.rule(MARGIN, PAGE_H - MARGIN - 2, CONTENT_W, "0.898 0.906 0.922", 0.5);
      page.y = PAGE_H - MARGIN - 18;
    }
  };

  const paragraph = (
    text: string,
    { size = 8.8, bold = false, color = INK, indent = 0, leading = 11.6, gap = 4 } = {},
  ) => {
    const lines = wrap(text, size, bold, CONTENT_W - indent);
    for (const line of lines) {
      ensure(leading);
      page.text(line, MARGIN + indent, page.y, size, bold, color);
      page.y -= leading;
    }
    page.y -= gap;
  };

  const bullet = (text: string) => {
    const lines = wrap(text, 8.4, false, CONTENT_W - 14);
    lines.forEach((line, index) => {
      ensure(10.6);
      if (index === 0) page.text("-", MARGIN + 2, page.y, 8.4, false, EMERALD);
      page.text(line, MARGIN + 14, page.y, 8.4, false, INK);
      page.y -= 10.6;
    });
    page.y -= 1.2;
  };

  // Header
  page.text(doc.name, MARGIN, page.y, 21, true, FOREST);
  page.y -= 17;
  page.text(doc.headline, MARGIN, page.y, 9, false, EMERALD);
  page.y -= 13;
  page.text(doc.contact.join("  ·  "), MARGIN, page.y, 8, false, QUIET);
  page.y -= 9;
  page.rule(MARGIN, page.y, CONTENT_W, FOREST, 1.1);
  page.y -= 18;

  for (const section of doc.sections) {
    ensure(34);
    page.text(section.title.toUpperCase(), MARGIN, page.y, 8.6, true, FOREST);
    page.y -= 5;
    page.rule(MARGIN, page.y, CONTENT_W, "0.898 0.906 0.922", 0.5);
    page.y -= 12;

    for (const block of section.blocks) {
      if (block.kind === "paragraph") {
        paragraph(block.text, { size: 8.8, leading: 11.8, gap: 6 });
      } else if (block.kind === "entry") {
        ensure(24);
        page.text(block.title, MARGIN, page.y, 9.6, true, INK);
        page.y -= 11;
        if (block.meta) {
          for (const line of wrap(block.meta, 7.8, false, CONTENT_W)) {
            ensure(10);
            page.text(line, MARGIN, page.y, 7.8, false, QUIET);
            page.y -= 9.8;
          }
        }
        page.y -= 2;
        block.bullets.forEach(bullet);
        page.y -= 5;
      } else if (block.kind === "bullets") {
        block.bullets.forEach(bullet);
        page.y -= 3;
      } else {
        for (const line of block.lines) {
          paragraph(line, { size: 8.4, leading: 10.8, gap: 2 });
        }
        page.y -= 2;
      }
    }
    page.y -= 6;
  }

  ensure(18);
  page.rule(MARGIN, page.y + 4, CONTENT_W, "0.898 0.906 0.922", 0.5);
  page.text(doc.footer, MARGIN, page.y - 6, 7.2, false, QUIET);

  // Serialise
  const objects: string[] = [];
  const pageIds = pages.map((_, index) => 5 + index * 2);
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");

  pages.forEach((p, index) => {
    const contentId = pageIds[index] + 1;
    const stream = p.ops.join("\n");
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    objects.push(`<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "latin1");
}

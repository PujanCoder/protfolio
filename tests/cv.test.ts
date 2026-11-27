import { describe, expect, it } from "vitest";
import { buildCv, cvVariants } from "@/lib/cv/content";
import { renderCv } from "@/lib/cv/pdf";

describe("CV generation", () => {
  it("produces a structurally valid PDF for every variant", () => {
    for (const variant of cvVariants) {
      const pdf = renderCv(buildCv(variant));
      const text = pdf.toString("latin1");
      expect(text.startsWith("%PDF-1.4")).toBe(true);
      expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
      expect(text).toContain("Pujan Pandey");
      expect(text).toContain("startxref");
      // xref offsets must point at real objects
      const startxref = Number(text.slice(text.lastIndexOf("startxref") + 10).trim().split("\n")[0]);
      expect(text.slice(startxref, startxref + 4)).toBe("xref");
    }
  });

  it("keeps every CV variant grounded in the same verified identity", () => {
    for (const variant of cvVariants) {
      const cv = buildCv(variant);
      expect(cv.name).toBe("Pujan Pandey");
      expect(cv.contact.join(" ")).toContain("pujanpandey012@gmail.com");
      const body = JSON.stringify(cv.sections);
      expect(body).toContain("Network Intrusion Detection");
    }
  });

  it("orders skills by the variant's focus", () => {
    const mlops = buildCv("mlops");
    const skills = mlops.sections.find((section) => section.title === "Technical skills");
    const lines = skills?.blocks[0];
    expect(lines?.kind).toBe("lines");
    if (lines?.kind === "lines") {
      expect(lines.lines[0].startsWith("MLOps & Experiment Tracking")).toBe(true);
    }
  });
});

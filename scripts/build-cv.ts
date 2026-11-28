import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildCv, cvVariants } from "../lib/cv/content";
import { renderCv } from "../lib/cv/pdf";

const outDir = join(process.cwd(), "public", "cv");
mkdirSync(outDir, { recursive: true });

for (const variant of cvVariants) {
  const pdf = renderCv(buildCv(variant));
  const file = join(outDir, `pujan-pandey-cv-${variant}.pdf`);
  writeFileSync(file, pdf);
  console.log(`cv: ${variant} -> public/cv/pujan-pandey-cv-${variant}.pdf (${pdf.length} bytes)`);
}

import { chromium } from "playwright";

const base = "http://localhost:13000/protfolio";
const routes = [
  "/", "/about/", "/projects/", "/projects/network-intrusion-detection/", "/projects/medical-imaging-mlops/",
  "/projects/gpt2-clone/", "/architecture/", "/compare/", "/playground/", "/quantum-lab/",
  "/cybersecurity-lab/", "/labs/", "/labs/intrusion-detection-operating-point/", "/journey/",
  "/achievements/", "/skills/", "/education/", "/activity/", "/assistant/", "/contact/",
  "/research/", "/research/zero-recall-cross-dataset/", "/blog/", "/blog/byte-level-bpe/", "/recruiter/",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
const pageErrors = [];
const bad = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160)); });
page.on("pageerror", (e) => pageErrors.push(e.message.slice(0, 160)));
page.on("response", (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });

for (const route of routes) {
  const res = await page.goto(base + route, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (res.status() !== 200 || overflow > 0) bad.push(`${res.status()} overflow:${overflow} ${route}`);
}

// interaction: assistant answers locally, no network call
await page.goto(base + "/assistant/", { waitUntil: "networkidle" });
const input = page.locator("input, textarea").first();
await input.fill("What did the medical imaging quality gate reject?");
await page.keyboard.press("Enter");
await page.waitForTimeout(2500);
const answerText = await page.evaluate(() => document.body.innerText);
const assistantOk = answerText.includes("0.236") || answerText.includes("recall");

console.log("routes checked:", routes.length);
console.log("bad:", bad.length, bad.slice(0, 6));
console.log("console errors:", consoleErrors.length, consoleErrors.slice(0, 3));
console.log("page errors:", pageErrors.length, pageErrors.slice(0, 3));
console.log("assistant answered locally:", assistantOk);
await browser.close();

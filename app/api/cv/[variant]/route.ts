import { NextResponse } from "next/server";
import { buildCv, isCvVariant } from "@/lib/cv/content";
import { renderCv } from "@/lib/cv/pdf";

export const runtime = "nodejs";

const fileNames: Record<string, string> = {
  "ai-ml": "Pujan-Pandey-CV-AI-ML-Engineer.pdf",
  mlops: "Pujan-Pandey-CV-MLOps-Engineer.pdf",
  security: "Pujan-Pandey-CV-Security-Developer.pdf",
  general: "Pujan-Pandey-CV-Software-Developer.pdf",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant } = await params;
  if (!isCvVariant(variant)) {
    return NextResponse.json(
      { error: "Unknown CV variant. Use ai-ml, mlops, security or general." },
      { status: 404 },
    );
  }

  const pdf = renderCv(buildCv(variant));
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${fileNames[variant]}"`,
      "cache-control": "public, max-age=3600",
    },
  });
}

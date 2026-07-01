import { NextResponse } from "next/server";

export const runtime = "nodejs";

type GeneratePanelRequest = {
  visualPrompt?: string;
  negativePrompt?: string;
  seed?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeneratePanelRequest;

    const visualPrompt = body.visualPrompt?.trim();
    const negativePrompt = body.negativePrompt?.trim();

    const seed =
      typeof body.seed === "number" && Number.isFinite(body.seed)
        ? body.seed
        : Date.now();

    if (!visualPrompt || visualPrompt.length < 10) {
      return NextResponse.json(
        { error: "Visual prompt is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.POLLINATIONS_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Pollinations API key is missing." },
        { status: 500 }
      );
    }

    const finalPrompt = `${visualPrompt}. Avoid: ${
      negativePrompt || "blurry, low quality, watermark, text, bad anatomy"
    }`;

    const encodedPrompt = encodeURIComponent(finalPrompt);

    const pollinationsUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?model=flux&width=1024&height=768&nologo=true&safe=true&seed=${seed}`;

    const imageResponse = await fetch(pollinationsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();

      return NextResponse.json(
        {
          error: "Image generation failed.",
          details: errorText,
        },
        { status: imageResponse.status }
      );
    }

    const contentType =
      imageResponse.headers.get("content-type") || "image/png";

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");

    return NextResponse.json({
      imageUrl: `data:${contentType};base64,${base64Image}`,
      seed,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate panel image." },
      { status: 500 }
    );
  }
}
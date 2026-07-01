import { NextResponse } from "next/server";

type AnalyzeScreenplayRequest = {
  title?: string;
  screenplay?: string;
  style?: string;
  characterNotes?: string;
};

function inferMood(text: string) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("rain") || lowerText.includes("thunder")) {
    return "Dramatic, lonely, rainy";
  }

  if (lowerText.includes("fight") || lowerText.includes("chase")) {
    return "Intense, action-driven, fast-paced";
  }

  if (lowerText.includes("school") || lowerText.includes("classroom")) {
    return "Quiet, emotional, slice-of-life";
  }

  if (lowerText.includes("night") || lowerText.includes("shadow")) {
    return "Mysterious, dark, suspenseful";
  }

  return "Cinematic, emotional, story-driven";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeScreenplayRequest;

    const title = body.title?.trim() || "Untitled Project";
    const screenplay = body.screenplay?.trim();
    const style = body.style?.trim() || "Cinematic anime";

    if (!screenplay || screenplay.length < 20) {
      return NextResponse.json(
        {
          error: "Screenplay text must be at least 20 characters.",
        },
        { status: 400 }
      );
    }

    const sceneBlocks = screenplay
      .split(/(?=(?:INT\.|EXT\.|INT\/EXT\.)\s)/gi)
      .map((scene) => scene.trim())
      .filter(Boolean);

    const blocks = sceneBlocks.length > 0 ? sceneBlocks : [screenplay];

    const scenes = blocks.slice(0, 3).map((block, index) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const heading = lines[0] || `Scene ${index + 1}`;
      const description = lines.slice(1).join(" ") || block;

      const cleanedHeading = heading
        .replace(/^(INT\.|EXT\.|INT\/EXT\.)\s*/i, "")
        .trim();

      const [locationPart, timePart] = cleanedHeading.split(/\s+-\s+/);

      return {
        sceneNumber: index + 1,
        title: `Scene ${index + 1} - ${locationPart || "Untitled Scene"}`,
        location: locationPart || "Unspecified location",
        timeOfDay: timePart || "Unspecified time",
        mood: inferMood(`${heading} ${description}`),
        summary:
          description.length > 220
            ? `${description.slice(0, 220)}...`
            : description,
      };
    });

    return NextResponse.json({
      projectTitle: title,
      style,
      sceneCount: scenes.length,
      scenes,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to analyze screenplay.",
      },
      { status: 500 }
    );
  }
}
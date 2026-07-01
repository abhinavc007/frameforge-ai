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

  if (lowerText.includes("forest") || lowerText.includes("spirit")) {
    return "Mystical, quiet, fantasy-driven";
  }

  if (lowerText.includes("castle") || lowerText.includes("beast")) {
    return "Epic, tense, dramatic";
  }

  return "Cinematic, emotional, story-driven";
}

function getStoryBeats(sceneSummary: string) {
  const sentences = sceneSummary
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return {
    openingBeat: sentences[0] || sceneSummary,
    actionBeat: sentences[1] || sentences[0] || sceneSummary,
    detailBeat: sentences[2] || sentences[1] || sentences[0] || sceneSummary,
    finalBeat:
      sentences[sentences.length - 1] ||
      sentences[2] ||
      sentences[1] ||
      sentences[0] ||
      sceneSummary,
  };
}

function createShotList(sceneSummary: string, style: string, mood: string) {
  const beats = getStoryBeats(sceneSummary);

  return [
    {
      shotNumber: 1,
      cameraAngle: "Wide establishing shot",
      description: `Establish the scene environment and atmosphere: ${beats.openingBeat}`,
      visualPrompt: `${style} storyboard panel, wide establishing shot, ${beats.openingBeat}, ${mood}, cinematic composition, atmospheric background, strong lighting`,
    },
    {
      shotNumber: 2,
      cameraAngle: "Medium action shot",
      description: `Show the main action or character movement: ${beats.actionBeat}`,
      visualPrompt: `${style} storyboard panel, medium action shot, ${beats.actionBeat}, expressive character pose, anime-style cinematic framing`,
    },
    {
      shotNumber: 3,
      cameraAngle: "Close-up detail shot",
      description: `Focus on an important emotion, object, or visual detail: ${beats.detailBeat}`,
      visualPrompt: `${style} storyboard panel, close-up detail shot, ${beats.detailBeat}, emotional focus, dramatic anime lighting`,
    },
    {
      shotNumber: 4,
      cameraAngle: "Final transition shot",
      description: `End the scene with a strong visual beat: ${beats.finalBeat}`,
      visualPrompt: `${style} storyboard panel, final transition shot, ${beats.finalBeat}, cinematic ending frame, ${mood}, strong visual atmosphere`,
    },
  ];
}

function cleanSceneHeading(heading: string) {
  return heading
    .replace(/^(INT\.|EXT\.|INT\/EXT\.)\s*/i, "")
    .replace(/^Scene\s+\d+\s*:?\s*/i, "")
    .trim();
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

    const headingRegex =
      /^\s*(?:(?:INT\.|EXT\.|INT\/EXT\.)\s+.+|Scene\s+\d+\s*:?\s*.+)$/gim;

    const headings = [...screenplay.matchAll(headingRegex)];

    const blocks =
      headings.length > 0
        ? headings.map((match, index) => {
            const start = match.index ?? 0;
            const end = headings[index + 1]?.index ?? screenplay.length;
            return screenplay.slice(start, end).trim();
          })
        : [screenplay.trim()];

    const scenes = blocks.slice(0, 6).map((block, index) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const heading = lines[0] || `Scene ${index + 1}`;
      const description = lines.slice(1).join(" ") || block;

      const cleanedHeading = cleanSceneHeading(heading);

      const [locationPart, timePart] = cleanedHeading.split(/\s+-\s+/);

      const sceneTitle =
        locationPart && locationPart.trim().length > 0
          ? locationPart.trim()
          : "Untitled Scene";

      const summary =
        description.length > 220
          ? `${description.slice(0, 220)}...`
          : description;

      const mood = inferMood(`${heading} ${description}`);

      return {
        sceneNumber: index + 1,
        title: `Scene ${index + 1} - ${sceneTitle}`,
        location: sceneTitle,
        timeOfDay: timePart || "Unspecified time",
        mood,
        summary,
        shots: createShotList(summary, style, mood),
      };
    });

    const totalShots = scenes.reduce(
      (total, scene) => total + scene.shots.length,
      0
    );

    return NextResponse.json({
      projectTitle: title,
      style,
      sceneCount: scenes.length,
      shotCount: totalShots,
      panelCount: totalShots,
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
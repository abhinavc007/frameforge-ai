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

function createShotList(sceneSummary: string, style: string) {
  return [
    {
      shotNumber: 1,
      cameraAngle: "Wide establishing shot",
      description: `Introduce the environment and mood of the scene: ${sceneSummary}`,
      visualPrompt: `${style} storyboard panel, wide establishing shot, cinematic composition, atmospheric background, strong mood lighting`,
    },
    {
      shotNumber: 2,
      cameraAngle: "Medium character shot",
      description:
        "Show the main character inside the scene and establish their action.",
      visualPrompt: `${style} storyboard panel, medium character shot, expressive pose, clear action, cinematic anime framing`,
    },
    {
      shotNumber: 3,
      cameraAngle: "Close-up emotional shot",
      description:
        "Focus on the character's emotion, reaction, or important detail.",
      visualPrompt: `${style} storyboard panel, close-up shot, emotional expression, dramatic lighting, anime-style detail`,
    },
    {
      shotNumber: 4,
      cameraAngle: "Final transition shot",
      description:
        "End the scene with a visual beat that leads into the next moment.",
      visualPrompt: `${style} storyboard panel, transition shot, cinematic ending frame, strong visual atmosphere`,
    },
  ];
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

    const firstSceneHeadingMatch = screenplay.match(
  /(?:^|\n)\s*(?:INT\.|EXT\.|INT\/EXT\.)\s/i
);

const screenplayForAnalysis =
  firstSceneHeadingMatch?.index !== undefined
    ? screenplay.slice(firstSceneHeadingMatch.index).trim()
    : screenplay;

const sceneBlocks = screenplayForAnalysis
  .split(/(?=^\s*(?:INT\.|EXT\.|INT\/EXT\.)\s)/gim)
  .map((scene) => scene.trim())
  .filter(Boolean);

const blocks = sceneBlocks.length > 0 ? sceneBlocks : [screenplayForAnalysis];

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

      const summary =
        description.length > 220
          ? `${description.slice(0, 220)}...`
          : description;

      return {
        sceneNumber: index + 1,
        title: `Scene ${index + 1} - ${locationPart || "Untitled Scene"}`,
        location: locationPart || "Unspecified location",
        timeOfDay: timePart || "Unspecified time",
        mood: inferMood(`${heading} ${description}`),
        summary,
        shots: createShotList(summary, style),
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
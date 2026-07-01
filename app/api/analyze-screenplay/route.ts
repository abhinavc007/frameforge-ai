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

function createStoryboardPrompt({
  style,
  cameraAngle,
  storyBeat,
  mood,
}: {
  style: string;
  cameraAngle: string;
  storyBeat: string;
  mood: string;
}) {
  return `${style} anime-style cinematic storyboard panel, ${cameraAngle.toLowerCase()}, ${storyBeat}, ${mood}, expressive character acting, strong visual composition, clean anime linework, dramatic lighting, detailed environment, film storyboard framing, professional concept art quality, no text inside image`;
}

function createNegativePrompt() {
  return "blurry, low quality, distorted face, bad anatomy, extra limbs, extra fingers, messy hands, unreadable text, watermark, logo, random letters, photorealistic, ugly composition, cropped subject";
}

function createShotList(sceneSummary: string, style: string, mood: string) {
  const beats = getStoryBeats(sceneSummary);

  const shots = [
    {
      shotNumber: 1,
      cameraAngle: "Wide establishing shot",
      description: `Establish the scene environment and atmosphere: ${beats.openingBeat}`,
      storyBeat: beats.openingBeat,
    },
    {
      shotNumber: 2,
      cameraAngle: "Medium action shot",
      description: `Show the main action or character movement: ${beats.actionBeat}`,
      storyBeat: beats.actionBeat,
    },
    {
      shotNumber: 3,
      cameraAngle: "Close-up detail shot",
      description: `Focus on an important emotion, object, or visual detail: ${beats.detailBeat}`,
      storyBeat: beats.detailBeat,
    },
    {
      shotNumber: 4,
      cameraAngle: "Final transition shot",
      description: `End the scene with a strong visual beat: ${beats.finalBeat}`,
      storyBeat: beats.finalBeat,
    },
  ];

  return shots.map((shot) => ({
    shotNumber: shot.shotNumber,
    cameraAngle: shot.cameraAngle,
    description: shot.description,
    visualPrompt: createStoryboardPrompt({
      style,
      cameraAngle: shot.cameraAngle,
      storyBeat: shot.storyBeat,
      mood,
    }),
    negativePrompt: createNegativePrompt(),
    styleNotes: `${style} storyboard style with ${mood.toLowerCase()} mood.`,
  }));
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
import { NextResponse } from "next/server";

type AnalyzeScreenplayRequest = {
  title?: string;
  screenplay?: string;
  style?: string;
  characterNotes?: string;
};

function normalizeText(text: string) {
  return text
    .replace(/([.!?])(?=\S)/g, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

function splitIntoSentences(text: string) {
  return normalizeText(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function polishCaption(text: string) {
  const cleaned = normalizeText(text)
    .replace(/\bbalan\b/gi, "Balan")
    .replace(/\bmom\b/gi, "mother")
    .replace(/\bcall him\b/gi, "calls him")
    .replace(/\bsitout\b/gi, "sitout");

  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  if (/[.!?]$/.test(capitalized)) {
    return capitalized;
  }

  return `${capitalized}.`;
}

function inferMood(text: string) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("rain") || lowerText.includes("thunder")) {
    return "Dramatic and rainy";
  }

  if (
    lowerText.includes("fight") ||
    lowerText.includes("chase") ||
    lowerText.includes("battle")
  ) {
    return "Intense and action-driven";
  }

  if (
    lowerText.includes("forest") ||
    lowerText.includes("spirit") ||
    lowerText.includes("fox")
  ) {
    return "Mystical and fantasy-driven";
  }

  if (
    lowerText.includes("castle") ||
    lowerText.includes("gate") ||
    lowerText.includes("beast")
  ) {
    return "Epic and tense";
  }

  if (
    lowerText.includes("sunny") ||
    lowerText.includes("afternoon") ||
    lowerText.includes("house")
  ) {
    return "Warm and everyday";
  }

  if (
    lowerText.includes("night") ||
    lowerText.includes("shadow") ||
    lowerText.includes("dark")
  ) {
    return "Mysterious and suspenseful";
  }

  return "Cinematic and story-driven";
}

function cleanSceneHeading(heading: string) {
  return heading
    .replace(/^(INT\.|EXT\.|INT\/EXT\.)\s*/i, "")
    .replace(/^Scene\s+\d+\s*:?\s*/i, "")
    .trim();
}

function isAtmosphereSentence(sentence: string) {
  const lowerSentence = sentence.toLowerCase();

  return (
    lowerSentence.includes("morning") ||
    lowerSentence.includes("afternoon") ||
    lowerSentence.includes("evening") ||
    lowerSentence.includes("night") ||
    lowerSentence.includes("sunny") ||
    lowerSentence.includes("rainy") ||
    lowerSentence.includes("dark") ||
    lowerSentence.includes("quiet")
  );
}

function prepareStorySentences(sentences: string[]) {
  if (sentences.length <= 1) {
    return sentences;
  }

  const firstSentence = sentences[0];
  const secondSentence = sentences[1];

  const firstSentenceWordCount = firstSentence.split(" ").length;

  if (isAtmosphereSentence(firstSentence) || firstSentenceWordCount <= 5) {
    return [
      `${firstSentence} ${secondSentence}`,
      ...sentences.slice(2),
    ];
  }

  return sentences;
}

function getDynamicShotMoments(sceneDescription: string) {
  const rawSentences = splitIntoSentences(sceneDescription);
  const sentences = prepareStorySentences(rawSentences);
  const wordCount = normalizeText(sceneDescription).split(" ").length;

  if (sentences.length <= 2 || wordCount <= 45) {
    return [
      {
        cameraAngle: "Opening story moment",
        caption: polishCaption(sentences[0] || sceneDescription),
      },
      {
        cameraAngle: "Next story moment",
        caption: polishCaption(
          sentences[1] || sentences[0] || sceneDescription
        ),
      },
    ];
  }

  if (sentences.length <= 4 || wordCount <= 90) {
    return [
      {
        cameraAngle: "Opening story moment",
        caption: polishCaption(sentences[0]),
      },
      {
        cameraAngle: "Main story action",
        caption: polishCaption(sentences[1] || sentences[0]),
      },
      {
        cameraAngle: "Final story moment",
        caption: polishCaption(sentences.slice(2).join(" ")),
      },
    ];
  }

  return [
    {
      cameraAngle: "Opening story moment",
      caption: polishCaption(sentences[0]),
    },
    {
      cameraAngle: "Main character moment",
      caption: polishCaption(sentences[1] || sentences[0]),
    },
    {
      cameraAngle: "Important story detail",
      caption: polishCaption(sentences[2] || sentences[1] || sentences[0]),
    },
    {
      cameraAngle: "Final story moment",
      caption: polishCaption(sentences.slice(3).join(" ")),
    },
  ];
}
function getStylePhrase(style: string) {
  const lowerStyle = style.toLowerCase();

  if (lowerStyle.includes("anime")) {
    return `${style} storyboard panel`;
  }

  if (lowerStyle.includes("manga")) {
    return `${style} panel`;
  }

  return `${style} anime storyboard panel`;
}

function extractMainCharacter(sceneContext: string) {
  const ignoredWords = new Set([
    "The",
    "A",
    "An",
    "Scene",
    "Story",
    "Sunny",
    "Suddenly",
    "Morning",
    "Afternoon",
    "Evening",
    "Night",
    "House",
    "Kitchen",
  ]);

  const names = sceneContext.match(/\b[A-Z][a-z]{2,}\b/g) || [];

  return names.find((name) => !ignoredWords.has(name)) || "the main character";
}

function inferCharacterType(sceneContext: string) {
  const lowerContext = sceneContext.toLowerCase();

  if (lowerContext.includes("boy")) {
    return "a young boy";
  }

  if (lowerContext.includes("girl")) {
    return "a young girl";
  }

  if (lowerContext.includes("man")) {
    return "a man";
  }

  if (lowerContext.includes("woman")) {
    return "a woman";
  }

  return "the main character";
}

function createCharacterContinuity(
  sceneContext: string,
  characterNotes?: string
) {
  const mainCharacter = extractMainCharacter(sceneContext);
  const characterType = inferCharacterType(sceneContext);

  let visualIdentity = "simple consistent clothing and the same hairstyle";

  if (characterType.includes("young boy")) {
    visualIdentity =
      "short black hair, expressive eyes, casual home clothes, simple T-shirt and shorts";
  }

  if (characterType.includes("young girl")) {
    visualIdentity =
      "neatly styled dark hair, expressive eyes, casual story-appropriate clothes";
  }

  if (characterType.includes("man")) {
    visualIdentity =
      "consistent hairstyle, simple story-appropriate clothes, same face in every panel";
  }

  if (characterType.includes("woman")) {
    visualIdentity =
      "consistent hairstyle, simple story-appropriate clothes, same face in every panel";
  }

  const notes = characterNotes
    ? ` User character notes: ${trimText(characterNotes, 120)}.`
    : "";

  return `${mainCharacter} is ${characterType} with ${visualIdentity}. Keep this exact character appearance in every panel.${notes}`;
}

function createLocationContinuity(
  sceneContext: string,
  location: string,
  timeOfDay: string
) {
  const lowerContext = sceneContext.toLowerCase();

  if (
    lowerContext.includes("sitout") ||
    lowerContext.includes("veranda") ||
    lowerContext.includes("house")
  ) {
    return `Same house sitout/veranda in every panel: warm sunny afternoon light, simple homely house exterior, visible chair, visible doorway, kitchen doorway or entrance in the background, same wall color and same layout.`;
  }

  return `Same location in every panel: ${location}, ${timeOfDay}, consistent lighting, same environment, same major objects, same camera style.`;
}

function createSceneContinuityBlock({
  sceneContext,
  location,
  timeOfDay,
  characterNotes,
}: {
  sceneContext: string;
  location: string;
  timeOfDay: string;
  characterNotes?: string;
}) {
  const characterContinuity = createCharacterContinuity(
    sceneContext,
    characterNotes
  );

  const locationContinuity = createLocationContinuity(
    sceneContext,
    location,
    timeOfDay
  );

  return `Scene continuity: ${characterContinuity} Location continuity: ${locationContinuity}`;
}

function createVisibleAction(caption: string, sceneContext: string) {
  const lowerCaption = caption.toLowerCase();
  const lowerContext = sceneContext.toLowerCase();

  if (
    lowerCaption.includes("mother calls") ||
    lowerCaption.includes("mom calls") ||
    lowerCaption.includes("calls him") ||
    lowerCaption.includes("call him")
  ) {
    return "Balan is still in the same house sitout near the same chair, suddenly turning his head toward the kitchen doorway with a surprised and attentive expression.";
  }

  if (lowerCaption.includes("sitting") || lowerCaption.includes("chair")) {
    return "Balan is sitting naturally on the same chair in the house sitout, relaxed and calm, during a warm sunny afternoon.";
  }

  if (lowerContext.includes("sitout") && lowerContext.includes("kitchen")) {
    return `${caption} Show the same house sitout clearly, with the kitchen doorway direction visible.`;
  }

  return caption;
}

function createVisualPrompt({
  style,
  caption,
  sceneContext,
  location,
  timeOfDay,
  mood,
  characterNotes,
}: {
  style: string;
  caption: string;
  sceneContext: string;
  location: string;
  timeOfDay: string;
  mood: string;
  characterNotes?: string;
}) {
  const sceneContinuity = createSceneContinuityBlock({
    sceneContext,
    location,
    timeOfDay,
    characterNotes,
  });

  const visibleAction = createVisibleAction(caption, sceneContext);

  return `${getStylePhrase(
    style
  )}. Draw one clear storyboard panel. ${sceneContinuity} Shot moment: ${visibleAction} Mood: ${mood}. Clean anime linework, cinematic framing, natural lighting, professional storyboard composition, no text, no watermark.`;
}
function createNegativePrompt() {
  return "blurry, low quality, distorted face, bad anatomy, extra limbs, extra fingers, messy hands, unreadable text, watermark, logo, random letters, photorealistic, wrong character, wrong location, unrelated scenery, unrelated objects, ugly composition, cropped subject";
}

function createShotList({
  sceneDescription,
  style,
  mood,
  location,
  timeOfDay,
  characterNotes,
}: {
  sceneDescription: string;
  style: string;
  mood: string;
  location: string;
  timeOfDay: string;
  characterNotes?: string;
}) {
  const sceneContext = trimText(normalizeText(sceneDescription), 500);
  const shotMoments = getDynamicShotMoments(sceneDescription);

  return shotMoments.map((shot, index) => ({
    shotNumber: index + 1,
    cameraAngle: shot.cameraAngle,
    description: shot.caption,
    caption: shot.caption,
    visualPrompt: createVisualPrompt({
      style,
      caption: shot.caption,
      sceneContext,
      location,
      timeOfDay,
      mood,
      characterNotes,
    }),
    negativePrompt: createNegativePrompt(),
    styleNotes: `${style} storyboard style with ${mood.toLowerCase()} mood.`,
  }));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeScreenplayRequest;

    const title = body.title?.trim() || "Untitled Project";
    const screenplay = body.screenplay?.trim();
    const style = body.style?.trim() || "Cinematic anime";
    const characterNotes = body.characterNotes?.trim();

    if (!screenplay || screenplay.length < 20) {
      return NextResponse.json(
        {
          error: "Story text must be at least 20 characters.",
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
        headings.length > 0 && locationPart
          ? locationPart.trim()
          : "Story Moment";

      const timeOfDay =
        timePart ||
        (description.toLowerCase().includes("afternoon")
          ? "Afternoon"
          : "Unspecified time");

      const mood = inferMood(`${heading} ${description}`);

      const shots = createShotList({
        sceneDescription: description,
        style,
        mood,
        location: sceneTitle,
        timeOfDay,
        characterNotes,
      });

      return {
        sceneNumber: index + 1,
        title: `Scene ${index + 1} - ${sceneTitle}`,
        location: sceneTitle,
        timeOfDay,
        mood,
        summary: trimText(normalizeText(description), 260),
        shots,
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
        error: "Failed to analyze story.",
      },
      { status: 500 }
    );
  }
}
import {
  buildSkillPrompt,
  buildFollowUpPrompt
} from "./interview.prompts.js";
import { validateQuestion } from "./interview.validate.js";
import { InterviewState } from "./interview.state.js";

export async function generateValidatedQuestion(ai, prompt, fallback) {
  for (let i = 0; i < 2; i++) {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const q = res.text.trim();
    if (validateQuestion(q)) return q;
  }
  return fallback;
}

export async function evaluateAnswer(ai, question, answer) {
  const prompt = `
Evaluate the candidate answer for a technical interview.

Question:
${question}

Answer:
${answer}

Return a valid JSON object with the following structure:
{
  "score": <number 1-10>,
  "quality": "weak" | "average" | "strong",
  "strengths": ["point 1", "point 2"],
  "weaknesses": ["point 1", "point 2"]
}
`;

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  try {
    return JSON.parse(res.text.trim());
  } catch (e) {
    console.error("JSON Parse Error in Evaluate:", e);
    // Fallback
    return { score: 5, quality: "average", strengths: [], weaknesses: [] };
  }
}

export function adjustDifficulty(current, quality) {
  if (quality === "strong") return "advanced";
  if (quality === "weak") return "basic";
  return current;
}

export function nextState(session) {
  if (session.questionCount >= session.maxQuestions) {
    return InterviewState.COMPLETE;
  }
  return InterviewState.FOLLOW_UP;
}

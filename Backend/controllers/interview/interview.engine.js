import {
  buildSkillPrompt,
  buildFollowUpPrompt
} from "./interview.prompts.js";
import { validateQuestion } from "./interview.validate.js";
import { InterviewState } from "./interview.state.js";
import { GoogleGenAI } from "@google/genai";
const ai=new GoogleGenAI({
    apiKey:process.env.GOOGLE_API_KEY});
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
Evaluate the candidate answer.

Question:
${question}

Answer:
${answer}

Return ONLY one word:
weak | average | strong
`;

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  return res.text.trim().toLowerCase();
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

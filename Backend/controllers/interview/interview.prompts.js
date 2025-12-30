// interview.prompts.js

/**
 * Prompt for first / skill-based question
 */
export function buildSkillPrompt(skill, difficulty) {
  return `
You are a technical interviewer.

Skill: ${skill}
Difficulty: ${difficulty}

Rules:
- Ask ONE interview question
- Max 20 words
- No explanation
- No hints
- Output ONLY the question
`;
}

/**
 * Prompt for follow-up question
 */
export function buildFollowUpPrompt(history, answerQuality) {
  const historyText = history.map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`).join("\n\n");

  return `
You are a technical interviewer.

Previous Conversation:
${historyText}

Candidate answer quality for the last question: ${answerQuality}

Rules:
- Ask ONE follow-up question based on the candidate's previous answers.
- If the candidate mentioned specific technologies or concepts, dig deeper into those.
- If the answer was weak, ask a simpler clarification question.
- If the answer was strong, ask a more advanced or edge-case question.
- Max 25 words.
- No explanation.
- Output ONLY the question.
`;
}

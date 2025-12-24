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
export function buildFollowUpPrompt(previousQuestion, answerQuality) {
  return `
You are a technical interviewer.

Previous question:
${previousQuestion}

Candidate answer quality: ${answerQuality}

Rules:
- Ask ONE follow-up question
- If weak → simpler
- If strong → deeper
- Max 20 words
- No explanation
- Output ONLY the question
`;
}

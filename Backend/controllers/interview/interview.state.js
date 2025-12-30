// interview.state.js

export const InterviewState = {
  START: "start",
  SKILL: "skill",
  FOLLOW_UP: "follow_up",
  COMPLETE: "complete"
};

/**
 * Creates a new interview session
 * This is the SINGLE source of truth for interview flow
 */
export function createInterviewSession(resumeJSON) {
  return {
    state: InterviewState.START,

    // 🔥 STORE RESUME HERE
    resume: resumeJSON,

    skillIndex: 0,

    difficulty:
      resumeJSON.experience_level === "fresher"
        ? "basic"
        : "intermediate",

    questionCount: 0,
    maxQuestions: 6,
    lastQuestion: null,
    history: []
  };
}


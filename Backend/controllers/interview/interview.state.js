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

    // indexes to control deterministic progression
    skillIndex: 0,

    // difficulty controlled by CODE, not LLM
    difficulty:
      resumeJSON.experience_level === "fresher"
        ? "basic"
        : "intermediate",

    // counters
    questionCount: 0,
    maxQuestions: 6,

    // memory
    lastQuestion: null
  };
}

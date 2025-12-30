import crypto from "crypto";
import { interviews } from "../interview/interview.store.js";
import { createInterviewSession, InterviewState } from "../interview/interview.state.js";
import {
  generateValidatedQuestion,
  evaluateAnswer,
  adjustDifficulty
} from "../interview/interview.engine.js";
import {
  buildSkillPrompt,
  buildFollowUpPrompt
} from "../interview/interview.prompts.js";

export const startInterview = (req, res) => {
  const resume = req.session.resumeProfile;
  if (!resume) {
    return res.status(400).json({ success: false, message: "No resume found" });
  }

  const session = createInterviewSession(resume);
  const id = crypto.randomUUID();

  session.lastQuestion = "Tell me about yourself.";
  interviews.set(id, session);

  res.json({
    success: true,
    interviewId: id,
    firstQuestion: session.lastQuestion
  });
};

export const handleAnswer = (io, ai) => {
  io.on("connection", (socket) => {
    socket.on("answer", async ({ interviewId, answer }) => {
      const session = interviews.get(interviewId);
      if (!session) return socket.emit("error", "Session not found");

      // 1. Save History
      if (session.lastQuestion) {
        session.history.push({
          question: session.lastQuestion,
          answer: answer
        });
      }

      let currentQuality = "average";

      // 2. Evaluate & Update State
      if (session.state === InterviewState.START) {
        session.state = InterviewState.SKILL;
      } else {
        const quality = await evaluateAnswer(ai, session.lastQuestion, answer);
        currentQuality = quality; // Keep for prompt
        session.difficulty = adjustDifficulty(session.difficulty, quality);

        // Toggle Logic: SKILL -> FOLLOW_UP -> SKILL
        if (session.state === InterviewState.SKILL) {
          session.state = InterviewState.FOLLOW_UP;
        } else {
          session.state = InterviewState.SKILL;
          session.skillIndex++; // Move to next skill only after follow-up
        }
      }

      // 3. Check Completion
      // Note: We might want fewer rounds if we do follow-ups. 
      // Let's cap total Interactions or verify session.skillIndex
      if (session.skillIndex >= session.resume.skills.length || session.questionCount >= session.maxQuestions) {
        interviews.delete(interviewId);
        return socket.emit("interview-complete");
      }
      session.questionCount++;

      // 4. Generate Prompt
      const skill = session.resume.skills[session.skillIndex] || "programming";

      let prompt;
      if (session.state === InterviewState.SKILL) {
        prompt = buildSkillPrompt(skill, session.difficulty);
      } else {
        // Follow up
        prompt = buildFollowUpPrompt(session.history, currentQuality);
      }

      const question = await generateValidatedQuestion(
        ai,
        prompt,
        "Can you explain that?"
      );

      session.lastQuestion = question;

      socket.emit("next-question", { question });
    });
  });
};

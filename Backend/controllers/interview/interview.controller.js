import {
  generateValidatedQuestion,
  evaluateAnswer,
  adjustDifficulty,
  nextState
} from "./interview.engine.js";
import {
  buildSkillPrompt,
  buildFollowUpPrompt
} from "./interview.prompts.js";
import { createInterviewSession } from "./interview.state.js";

export const startInterview = async (req, res) => {
  const resume = req.session.resumeProfile;
  if (!resume) return res.status(400).json({ success: false,message:"no resume in req.resume.Profile" });

  const session = createInterviewSession(resume);
  const skill = resume.skills[0];

  const question = await generateValidatedQuestion(
    req.app.locals.ai,
    buildSkillPrompt(skill, session.difficulty),
    "What is the JVM and why is it important?"
  );

  session.state = "skill";
  session.lastQuestion = question;
  session.questionCount = 1;

  req.session.interview = session;

  res.json({ success: true, question });
};

export const handleAnswer = async (req, res) => {
  const session = req.session.interview;
  if (!session) return res.status(400).json({ success: false });

  const answer = req.body.answer.slice(0, 800);

  const quality = await evaluateAnswer(
    req.app.locals.ai,
    session.lastQuestion,
    answer
  );

  session.difficulty = adjustDifficulty(session.difficulty, quality);
  session.questionCount++;
  session.state = nextState(session);

  if (session.state === "complete") {
    return res.json({ state: "complete" });
  }

  const followUp = await generateValidatedQuestion(
    req.app.locals.ai,
    buildFollowUpPrompt(session.lastQuestion, quality),
    "Can you explain that more simply?"
  );

  session.lastQuestion = followUp;

  res.json({ state: session.state, nextQuestion: followUp });
};

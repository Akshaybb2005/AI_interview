import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
dotenv.config();
import { GoogleGenAI } from '@google/genai';
import { init, init_Chathistory } from './services/pdf.js';
import authRoutes from './routes/Authroutes.js';
import interviewRoutes from './routes/InterviewRoutes.js';
const app = express();
const port = 3000;
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});
app.locals.ai=ai;


app.use(express.json());
app.use(session({
  secret: "interview-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));
app.use(cors());
app.use('/auth', authRoutes);
app.use('/interview', interviewRoutes);

const serverstart = async () => {
  await init();
  await init_Chathistory();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

serverstart();

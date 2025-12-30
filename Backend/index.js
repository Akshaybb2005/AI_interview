import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";

import { GoogleGenAI } from "@google/genai";
import { init, init_Chathistory } from "./services/pdf.js";
import authRoutes from "./routes/Authroutes.js";
import interviewRoutes from "./routes/InterviewRoutes.js";
import { handleAnswer } from "./controllers/interview/interview.controller.js";
dotenv.config();

const app = express();
const port = 3000;

/* ================= AI ================= */
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});
app.locals.ai = ai;

/* ================= CORS (MUST BE FIRST) ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json());

/* ================= SESSION ================= */
const sessionMiddleware = session({
  name: "interview.sid",
  secret: "interview-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: false
  }
});

app.use(sessionMiddleware);

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/interview", interviewRoutes);

/* ================= HTTP + SOCKET ================= */
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});


app.locals.io = io;

/* 🔥 SHARE SESSION WITH SOCKET.IO */
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

handleAnswer(io, ai);
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* ================= START SERVER (ONLY ONCE) ================= */
const serverstart = async () => {
  await init();
  await init_Chathistory();

  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

serverstart();

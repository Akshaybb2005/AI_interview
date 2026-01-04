import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../AxiosInstance.js";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { setResults } from "../Redux/markSlics.js";
/* 🔥 CREATE SOCKET ONCE (OUTSIDE COMPONENT) */
const socket = io("http://localhost:3000", {
  withCredentials: true,
});

const Interview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(""); // Ref to hold latest text for closures

  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [started, setStarted] = useState(false);

  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is speaking

  /* ================= CAMERA ================= */

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // We only need video here, mic is separate via WebSpeech
      });
      streamRef.current = stream;
      setCamOn(true);
    } catch (err) {
      console.error("Camera error:", err);
      // alert("Camera access denied"); // Optional: fail silently or show UI error
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCamOn(false);
  };

  useEffect(() => {
    if (camOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [camOn]);

  /* ================= SPEECH TO TEXT ================= */

  const startListening = () => {
    if (!started) return;

    // Stop AI speech if user interrupts
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false; // Stop after one sentence/phrase
    recognition.interimResults = true; // Show progress

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
      transcriptRef.current = transcript;
    };

    recognition.onerror = (e) => {
      console.error("Speech error", e);
      stopListening();
    };

    // Auto-submit when speech ends
    recognition.onend = () => {
      setMicOn(false);
      submitAnswer();
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setMicOn(true);
      setText(""); // Clear previous
      transcriptRef.current = "";
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setMicOn(false);
  };

  const submitAnswer = () => {
    const answerText = transcriptRef.current;
    if (!answerText.trim() || !interviewId) return;

    socket.emit("answer", {
      interviewId,
      answer: answerText
    });

    setText("");
    transcriptRef.current = "";
  };

  /* ================= TEXT TO SPEECH ================= */

  const speakText = (content) => {
    if (!window.speechSynthesis || !content) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "en-US";
    utterance.rate = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Optional: Auto-start listening after AI finishes?
      // setTimeout(startListening, 500); // Experimental: seamless loop
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (question) {
      speakText(question);
    }
  }, [question]);

  /* ================= SOCKET LISTENERS ================= */

  useEffect(() => {
    socket.on("next-question", ({ question }) => {
      setQuestion(question);
      setText("");
      transcriptRef.current = "";
    });

    socket.on("interview-complete", (results) => {
      alert("Interview completed!");
      setStarted(false);
      stopCamera();
      dispatch(setResults(
        {strengths: results.strengths,
        weaknesses: results.weaknesses,
        score: results.averageScore}
      ));
      navigate("/dashboard");
    });

    return () => {
      socket.off("next-question");
      socket.off("interview-complete");
    };
  }, []);

  /* ================= START INTERVIEW ================= */

  const startInterview = async () => {
    try {
      const res = await Axios.post("/interview/startInterview");
      const { interviewId, firstQuestion } = res.data;

      setInterviewId(interviewId);
      setQuestion(firstQuestion);
      setStarted(true);

      startCamera();
    } catch (err) {
      console.error("Failed to start interview", err);
      alert("Failed to start interview");
    }
  };

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      stopCamera();
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col">

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex justify-between items-center">
        <h1 className="font-semibold text-lg tracking-wide">AI Mock Interview</h1>
        <div className="flex items-center gap-3">
          {started && <span className="animate-pulse text-red-500 text-xs font-bold uppercase">● Live</span>}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto w-full">

        {/* CAMERA SECTION */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className={`relative bg-black rounded-3xl border-2 overflow-hidden shadow-2xl flex items-center justify-center aspect-video ${camOn ? "border-indigo-500/50" : "border-white/10"}`}>
            {camOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
              />
            ) : (
              <div className="text-gray-500 flex flex-col items-center">
                <span className="text-4xl mb-2">📷</span>
                <p>Camera is Off</p>
              </div>
            )}

            {/* Overlay Status */}
            <div className="absolute top-4 right-4 flex gap-2">
              {micOn && <div className="bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">Listening...</div>}
              {isSpeaking && <div className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">Speaking...</div>}
            </div>
          </div>

          {/* TRANSCRIPT OVERLAY (Optional subtitle style) */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5 min-h-[80px]">
            <p className="text-gray-400 text-xs uppercase mb-1">Live Transcript</p>
            <p className="text-lg text-white font-medium">{text || "..."}</p>
          </div>
        </div>

        {/* CONTROLS & QUESTION */}
        <div className="flex flex-col gap-4">

          {/* QUESTION CARD */}
          <div className="bg-gray-800/80 p-6 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">Current Question</p>
            <p className="text-xl font-light leading-relaxed">{question || "Press Start to begin..."}</p>
          </div>

          {/* CONTROLS */}
          <div className="flex-1 bg-black/20 rounded-3xl border border-white/5 p-6 flex flex-col justify-end gap-4">

            {!started ? (
              <button
                onClick={startInterview}
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                Start Interview
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={micOn ? stopListening : startListening}
                  className={`col-span-2 py-6 rounded-2xl font-bold text-xl transition-all shadow-lg flex items-center justify-center gap-2 ${micOn
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 animate-pulse"
                    : "bg-white text-black hover:bg-gray-100"
                    }`}
                >
                  {micOn ? "Tap to Process" : "Tap to Speak"}
                </button>

                <button
                  onClick={camOn ? stopCamera : startCamera}
                  className={`py-3 rounded-xl font-medium text-sm border transition-all ${camOn
                    ? "border-red-500/50 text-red-400 hover:bg-red-500/10"
                    : "border-white/10 text-gray-400 hover:bg-white/5"
                    }`}
                >
                  {camOn ? "Stop Camera" : "Start Camera"}
                </button>

                <button
                  onClick={() => speakText(question)}
                  className="py-3 rounded-xl font-medium text-sm border border-white/10 text-gray-400 hover:bg-white/5"
                >
                  Replay Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;

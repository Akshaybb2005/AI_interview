import React, { useState } from "react";
import axios from "../AxiosInstance.js";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= UPLOAD RESUME ================= */

  const uploadResume = async () => {
    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setLoading(true);
      await axios.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowUpload(false);
      navigate("/interview");
    } catch (error) {
      console.error(error);
      alert("Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white min-h-screen">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
              AI
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold">
              Mock<span className="text-indigo-400">Interview</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-gray-300 hover:text-indigo-400">
              Features
            </a>
            <a href="#how" className="text-gray-300 hover:text-indigo-400">
              How it Works
            </a>
            <button className="bg-indigo-600 px-5 py-2 rounded-xl">
              Login
            </button>
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-6 space-y-4 bg-black/80">
            <a href="#features">Features</a>
            <a href="#how">How it Works</a>
            <button className="w-full bg-indigo-600 py-2 rounded-xl">
              Login
            </button>
          </div>
        )}
      </nav>

      {/* ================= HERO ================= */}
      <section className="flex flex-col md:flex-row items-center px-8 md:px-20 py-20 gap-12">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Crack Interviews with{" "}
            <span className="text-indigo-400">AI-Powered</span> Mock Interviews
          </h2>

          <p className="mt-6 text-gray-300">
            Real voice-based interviews generated from your resume.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setShowUpload(true)}
              className="bg-indigo-600 px-6 py-3 rounded-xl shadow-lg"
            >
              Start Interview
            </button>

            <button
              onClick={() => setShowUpload(true)}
              className="border border-gray-500 px-6 py-3 rounded-xl"
            >
              Upload Resume
            </button>
          </div>
        </div>

        <div className="bg-gray-800/80 rounded-2xl p-6 w-full max-w-md border border-white/10">
          <p className="text-sm text-gray-400 mb-3">Live Interview Preview</p>
          <div className="bg-black/70 rounded-lg p-4">
            <p className="text-indigo-400">AI Interviewer:</p>
            <p>Explain REST vs GraphQL.</p>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="px-8 md:px-20 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Platform?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            ["Resume-Based Questions", "Questions from your projects"],
            ["Voice Interviews", "Speak like real interviews"],
            ["Smart Follow-ups", "Adaptive difficulty"],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="bg-gray-800 p-6 rounded-2xl border border-white/10"
            >
              <h4 className="text-xl text-indigo-400">{title}</h4>
              <p className="text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="px-8 md:px-20 py-16 bg-gray-900/70">
        <h3 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h3>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          {["Upload Resume", "AI Analysis", "Voice Interview", "Feedback"].map(
            (step, i) => (
              <div
                key={i}
                className="bg-gray-800 p-6 rounded-2xl border border-white/10"
              >
                <div className="text-3xl text-indigo-400">{i + 1}</div>
                <p>{step}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="text-center py-20">
        <h3 className="text-4xl font-bold mb-6">
          Ready to Face Your Next Interview?
        </h3>
        <button
          onClick={() => setShowUpload(true)}
          className="bg-indigo-600 px-10 py-4 rounded-2xl text-lg"
        >
          Get Started Now
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-6 border-t border-white/10 text-gray-500">
        © 2025 AI Mock Interview Platform
      </footer>

      {/* ================= UPLOAD MODAL ================= */}
      {showUpload && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl">

      <h3 className="text-2xl font-bold mb-4 text-center">
        Upload Your Resume
      </h3>

      {/* CUSTOM UPLOAD BOX */}
      <label
        htmlFor="resume-upload"
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 cursor-pointer hover:border-indigo-400 transition"
      >
        <svg
          className="w-10 h-10 text-indigo-400 mb-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
          />
        </svg>

        {!resume ? (
          <>
            <p className="text-gray-300 font-medium">
              Click to upload resume
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX (Max 5MB)
            </p>
          </>
        ) : (
          <p className="text-indigo-400 font-medium">
            {resume.name}
          </p>
        )}
      </label>

      {/* REAL FILE INPUT (HIDDEN) */}
      <input
        id="resume-upload"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResume(e.target.files[0])}
        className="hidden"
      />

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => setShowUpload(false)}
          className="px-4 py-2 rounded-lg border border-gray-500 hover:border-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={uploadResume}
          disabled={!resume || loading}
          className={`px-5 py-2 rounded-lg shadow transition
            ${
              resume
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-700 cursor-not-allowed"
            }`}
        >
          {loading ? "Uploading..." : "Start Interview"}
        </button>
      </div>


    </div>
  </div>
)}

    </div>
  );
};

export default Homepage;

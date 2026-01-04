import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 px-5 py-2 rounded-xl"
            >
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
            <a href="#features" className="block">
              Features
            </a>
            <a href="#how" className="block">
              How it Works
            </a>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600 py-2 rounded-xl"
            >
              Login
            </button>
          </div>
        )}
      </nav>

      {/* ================= HERO ================= */}
      <section className="flex flex-col md:flex-row items-center px-8 md:px-20 py-24 gap-12">

        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Crack Interviews with{" "}
            <span className="text-indigo-400">AI-Powered</span> Mock Interviews
          </h2>

          <p className="mt-6 text-gray-300">
            Real voice-based interviews tailored to your skills and experience.
          </p>

          <div className="mt-10">
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 px-10 py-4 rounded-2xl shadow-lg text-lg hover:bg-indigo-700 transition"
            >
              Get Started
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
            ["Resume-Based Questions", "Questions from your projects & skills"],
            ["Voice Interviews", "Speak like a real interview"],
            ["Smart Follow-ups", "Adaptive AI difficulty"],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="bg-gray-800 p-6 rounded-2xl border border-white/10"
            >
              <h4 className="text-xl text-indigo-400 mb-2">{title}</h4>
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
          {["Login", "Upload Resume", "Voice Interview", "AI Feedback"].map(
            (step, i) => (
              <div
                key={i}
                className="bg-gray-800 p-6 rounded-2xl border border-white/10"
              >
                <div className="text-3xl text-indigo-400 mb-2">{i + 1}</div>
                <p>{step}</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="text-center py-24">
        <h3 className="text-4xl font-bold mb-8">
          Ready to Face Your Next Interview?
        </h3>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 px-12 py-4 rounded-2xl text-lg hover:bg-indigo-700 transition"
        >
          Get Started Now
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-6 border-t border-white/10 text-gray-500">
        © 2025 AI Mock Interview Platform
      </footer>

    </div>
  );
};

export default Homepage;

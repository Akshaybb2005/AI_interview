import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-6">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Interview Performance Dashboard</h1>
        <p className="text-gray-400 mt-1">
          AI-based evaluation of your mock interview
        </p>
      </div>

      {/* ================= SCORE CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <ScoreCard title="Overall Score" value="78%" color="indigo" />
        <ScoreCard title="Communication" value="82%" color="green" />
        <ScoreCard title="Technical Depth" value="71%" color="yellow" />
        <ScoreCard title="Confidence" value="75%" color="blue" />

      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ===== SKILL PERFORMANCE ===== */}
        <div className="lg:col-span-2 bg-gray-900/70 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Skill-wise Performance</h2>

          <Bar label="JavaScript" value={80} />
          <Bar label="React" value={72} />
          <Bar label="DSA" value={65} />
          <Bar label="System Design" value={58} />
          <Bar label="Communication" value={82} />
        </div>

        {/* ===== STRENGTH & WEAKNESS ===== */}
        <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Insights</h2>

          <div className="mb-6">
            <h3 className="text-green-400 mb-2 font-medium">Strengths</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>✔ Clear explanation of concepts</li>
              <li>✔ Strong React fundamentals</li>
              <li>✔ Good API knowledge</li>
            </ul>
          </div>

          <div>
            <h3 className="text-red-400 mb-2 font-medium">Weaknesses</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>✖ System Design depth</li>
              <li>✖ Edge case handling</li>
              <li>✖ Time complexity explanation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ================= SUGGESTIONS ================= */}
      <div className="mt-10 bg-gray-900/70 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recommended Topics to Improve</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            "System Design Basics",
            "Big-O Analysis",
            "Database Indexing",
            "Scalability Patterns",
            "Error Handling Strategies",
            "Behavioral STAR Method",
          ].map((topic, i) => (
            <div
              key={i}
              className="bg-gray-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm hover:bg-indigo-600/20 transition"
            >
              📘 {topic}
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER ACTION ================= */}
      <div className="mt-12 flex justify-center">
        <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition">
          Start Another Interview
        </button>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const ScoreCard = ({ title, value, color }) => (
  <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6 text-center">
    <p className="text-gray-400 text-sm mb-2">{title}</p>
    <p className={`text-4xl font-bold text-${color}-400`}>{value}</p>
  </div>
);

const Bar = ({ label, value }) => (
  <div className="mb-5">
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span className="text-gray-400">{value}%</span>
    </div>
    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-indigo-600 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default Dashboard;

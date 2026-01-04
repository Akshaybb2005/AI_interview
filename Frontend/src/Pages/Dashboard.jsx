import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../Redux/Slice";
import { resetResults } from "../Redux/markSlics";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ SAFE SELECTOR
  const marks = useSelector((state) => state.marks || {
    score: 0,
    strengths: [],
    weaknesses: [],
  });

  const { score, strengths, weaknesses } = marks;

  const averageScore = score || 0;

  const finalStrengths =
    strengths.length > 0 ? strengths : ["No data available"];

  const finalWeaknesses =
    weaknesses.length > 0 ? weaknesses : ["No data available"];

  const logout = () => {
    dispatch(clearUser());
    dispatch(resetResults()); // ✅ IMPORTANT
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-6 relative">

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm shadow-md"
      >
        Logout
      </button>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Interview Performance Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          AI-based evaluation of your mock interview
        </p>
      </div>

      {/* SCORE */}
      <div className="flex justify-center mb-10">
        <div className="w-full max-w-sm">
          <ScoreCard
            title="Overall Score"
            value={`${averageScore}%`}
          />
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Insights</h2>

          {/* Strengths */}
          <div className="mb-6">
            <h3 className="text-green-400 mb-2 font-medium">
              Strengths
            </h3>
            <ul className="text-sm space-y-2 text-gray-300">
              {finalStrengths.map((s, i) => (
                <li key={i}>✔ {s}</li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div>
            <h3 className="text-red-400 mb-2 font-medium">
              Weaknesses
            </h3>
            <ul className="text-sm space-y-2 text-gray-300">
              {finalWeaknesses.map((w, i) => (
                <li key={i}>✖ {w}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => {
            dispatch(resetResults());
            navigate("/");
          }}
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl shadow-lg"
        >
          Start Another Interview
        </button>
      </div>
    </div>
  );
};

/* ================= SCORE CARD ================= */
const ScoreCard = ({ title, value }) => (
  <div className="bg-gray-900/70 border border-white/10 rounded-2xl p-6 text-center">
    <p className="text-gray-400 text-sm mb-2">{title}</p>
    <p className="text-4xl font-bold text-indigo-400">{value}</p>
  </div>
);

export default Dashboard;

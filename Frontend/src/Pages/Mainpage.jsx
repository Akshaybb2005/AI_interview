import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../AxiosInstance.js";
import { useDispatch } from "react-redux";
import { clearUser } from "../Redux/Slice.js";
const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [resume, setResume] = useState(null);
   
  const handleLogout = async () => {
    const res=await Axios.post("/auth/logout");
    dispatch(clearUser());
    console.log(res.data);
    navigate("/login");
  };
const uploadResume = async () => {
   try {
     const formdata=new FormData();
    formdata.append("resume",resume);
    const response=await Axios.post("/interview/uploadresume",formdata);
    console.log(response.data);
    alert("Resume uploaded successfully");
    await analyseResume();
    navigate("/interview");
   } catch (error) {
        console.error("Error uploading resume:", error);
   }
    }
const analyseResume=async()=>{
    try {
        const response=await Axios.post("/interview/analyzeResume");  
        console.log("Resume analysis response:",response.data);
    } catch (error) {
        console.error("Error analyzing resume:", error);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">

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

          <div className="flex items-center gap-6 text-sm">
            <button className="text-gray-300 hover:text-indigo-400">
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-xl"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-4xl font-extrabold mb-4">
          Welcome Back 👋
        </h2>
        <p className="text-gray-400 mb-14 max-w-2xl">
          Practice AI-powered mock interviews and boost your confidence.
        </p>

        {/* ================= CARDS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Start Interview */}
          <div className="bg-gray-800/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-2xl font-bold text-indigo-400 mb-3">
              Start Interview
            </h3>
            <p className="text-gray-300 mb-6">
              Upload your resume and begin an AI-powered interview.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl shadow-lg"
            >
              Start Interview
            </button>
          </div>

          {/* History */}
          <div className="bg-gray-800/80 border border-white/10 rounded-2xl p-8 shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-indigo-400 mb-3">
              Interview History
            </h3>
            <p className="text-gray-300 mb-6">
              Review your previous interview attempts.
            </p>
            <button className="w-full border border-gray-500 py-3 rounded-xl">
              View History
            </button>
          </div>

          {/* Profile */}
          <div className="bg-gray-800/80 border border-white/10 rounded-2xl p-8 shadow-xl hover:scale-105 transition">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-2xl font-bold text-indigo-400 mb-3">
              Profile
            </h3>
            <p className="text-gray-300 mb-6">
              Manage resume and personal details.
            </p>
            <button className="w-full border border-gray-500 py-3 rounded-xl">
              Open Profile
            </button>
          </div>

        </section>
      </main>

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

            {/* Upload Box */}
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 cursor-pointer hover:border-indigo-400 transition"
            >
              <div className="text-4xl mb-3">📄</div>

              {!resume ? (
                <>
                  <p className="text-gray-300 font-medium">
                    Click to upload resume
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX
                  </p>
                </>
              ) : (
                <p className="text-indigo-400 font-medium">
                  {resume.name}
                </p>
              )}
            </label>

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
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!resume}
                onClick={uploadResume}
                className={`px-5 py-2 rounded-lg shadow transition
                  ${
                    resume
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-700 cursor-not-allowed"
                  }`}
              >
                Proceed
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;

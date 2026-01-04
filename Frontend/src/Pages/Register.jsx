import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slice.js";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        form,
        { withCredentials: true }
      );

      setMessage("🎉 Registration successful");
      dispatch(setUser(response.data.user));
      setForm({ name: "", email: "", password: "" });
      navigate("/main")
    } catch (err) {
      setError(true);
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">

      {/* Left Panel (Branding) */}
      <div className="hidden lg:flex flex-col justify-center px-16 text-white">
        <h1 className="text-5xl font-extrabold leading-tight">
          AI Interview <br /> Platform
        </h1>
        <p className="mt-6 text-lg text-indigo-200">
          Practice real interviews powered by AI, voice interaction, and
          intelligent feedback.
        </p>

        <ul className="mt-8 space-y-3 text-indigo-100">
          <li>🎙 Voice-based interviews</li>
          <li>🤖 Adaptive AI questioning</li>
          <li>📄 Resume-aware evaluation</li>
          <li>📊 Instant feedback</li>
        </ul>
      </div>

      {/* Right Panel (Form) */}
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">

          {/* Header */}
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Create Your Account
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Start your AI-powered interview journey
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 w-full px-4 py-2 rounded-lg border
                  focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="candidate@example.com"
                className="mt-1 w-full px-4 py-2 rounded-lg border
                  focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 rounded-lg border
                  focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white font-semibold rounded-lg
                bg-indigo-600 hover:bg-indigo-700
                transition duration-200
                disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* Message */}
          {message && (
            <p
              className={`mt-4 text-center text-sm font-medium ${error ? "text-red-600" : "text-green-600"
                }`}
            >
              {message}
            </p>
          )}

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already registered?{" "}
            <span className="text-indigo-600 hover:underline cursor-pointer">
              Login to interview panel
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

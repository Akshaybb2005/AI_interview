import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({
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
      const response=await axios.post(
        "http://localhost:3000/auth/login",
        form,
        { withCredentials: true }
      );

      setMessage("✅ Login successful");
      dispatch(setUser(response.data.user));
      // later → navigate("/dashboard")
    } catch (err) {
      setError(true);
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-gray-800">
          AI Interview Panel
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Sign in to start your mock interview
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
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
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              error ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          New candidate?{" "}
          <span className="text-indigo-600 hover:underline cursor-pointer">
            Create an account
          </span>
        </div>

      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Forget() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [showCode, setShowCode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handelSubmit(e) {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to send verification code");
        return;
      }

      alert(data.message);

      setShowCode(true);
    } catch (error) {
      console.log("Forgot Password Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handelVerify(e) {
    e.preventDefault();

    if (!code) {
      alert("Please enter verification code");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            code: code,
          }),
        }
      );

      const data = await response.json();

      console.log("VERIFY RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Invalid verification code");
        return;
      }

      setCode("");
      setShowCode(false);
      setShowPasswordForm(true);
    } catch (error) {
      console.log("Verify Code Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handelChangePassword(e) {
    e.preventDefault();

    if (!password || !repassword) {
      alert("Please enter both passwords");
      return;
    }

    if (password !== repassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Password reset failed");
        return;
      }

      alert(data.message);

      setPassword("");
      setRepassword("");

      navigate("/login");
    } catch (error) {
      console.log("Reset Password Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32"
              viewBox="0 -960 960 960"
              width="32"
              fill="#4f46e5"
            >
              <path d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-200v-80h320v80H320Zm-40-120q-33 0-56.5-23.5T200-400v-80h80v80h400v-80h80v80q0 33-23.5 56.5T680-320H280Zm200-120q-75 0-127.5-52.5T300-620q0-75 52.5-127.5T480-800q75 0 127.5 52.5T660-620q0 75-52.5 127.5T480-440Zm0-80q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z" />
            </svg>

          </div>

          <h1 className="text-3xl font-bold text-gray-800">

            {showPasswordForm
              ? "Create New Password"
              : showCode
              ? "Verify Your Email"
              : "Forgot Password"}

          </h1>

          <p className="text-gray-500 mt-2">

            {showPasswordForm
              ? "Create a strong password for your account"
              : showCode
              ? "Enter the verification code sent to your email"
              : "Enter your email to reset your password"}

          </p>

        </div>


        <div className="flex items-center justify-center mb-8">

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              !showCode && !showPasswordForm
                ? "bg-indigo-600 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            1
          </div>

          <div
            className={`w-16 h-1 ${
              showCode || showPasswordForm
                ? "bg-green-500"
                : "bg-gray-200"
            }`}
          />

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              showCode
                ? "bg-indigo-600 text-white"
                : showPasswordForm
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>

          <div
            className={`w-16 h-1 ${
              showPasswordForm
                ? "bg-green-500"
                : "bg-gray-200"
            }`}
          />

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              showPasswordForm
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>

        </div>


        {!showCode && !showPasswordForm && (

          <form
            onSubmit={handelSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                placeholder="Enter your registered email"
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
              {loading
                ? "Sending..."
                : "Send Verification Code"}
            </button>

          </form>

        )}


        {showCode && (

          <form
            onSubmit={handelVerify}
            className="space-y-5"
          >

            <div className="bg-indigo-50 rounded-xl p-4 text-center">

              <p className="text-sm text-gray-600">
                Verification code sent to
              </p>

              <p className="font-semibold text-indigo-600 mt-1 break-all">
                {email}
              </p>

            </div>

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>

              <input
                type="text"
                value={code}
                placeholder="Enter 6-digit code"
                onChange={(e) =>
                  setCode(e.target.value)
                }
                maxLength="6"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-bold outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
              {loading
                ? "Verifying..."
                : "Verify Code"}
            </button>

          </form>

        )}


        {showPasswordForm && (

          <form
            onSubmit={handelChangePassword}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  placeholder="Enter new password"
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showRepassword
                      ? "text"
                      : "password"
                  }
                  value={repassword}
                  placeholder="Confirm new password"
                  onChange={(e) =>
                    setRepassword(e.target.value)
                  }
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowRepassword(!showRepassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showRepassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
              {loading
                ? "Changing Password..."
                : "Change Password"}
            </button>

          </form>

        )}


        <p className="text-center text-gray-600 mt-7">

          Remember your password?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="text-indigo-600 font-semibold hover:underline"
          >
            Log in
          </button>

        </p>

      </div>

    </div>
  );
}

export default Forget;
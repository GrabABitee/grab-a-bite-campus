import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function AuthPage() {

  const navigate = useNavigate();

  /*
  =========================================
  STATES
  =========================================
  */

  const [mode, setMode] =
    useState("signin");

  const [step, setStep] =
    useState("form");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [name, setName] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
  =========================================
  API
  =========================================
  */

  const API =
    import.meta.env.VITE_API_URL;

  /*
  =========================================
  SEND OTP
  =========================================
  */

  const sendOtp = async () => {

    if (!email || !password || !name) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      await axios.post(
        `${API}/auth/send-otp`,
        {
          email,
        }
      );

      alert("OTP sent successfully");

      setStep("otp");

    } catch (error) {

      console.log(error);

      alert("Failed to send OTP");

    } finally {

      setLoading(false);
    }
  };

  /*
  =========================================
  VERIFY OTP + REGISTER
  =========================================
  */

  const verifyOtp = async () => {

    if (!otp) {

      alert("Please enter OTP");

      return;
    }

    try {

      setLoading(true);

      /*
      =========================================
      VERIFY OTP
      =========================================
      */

      await axios.post(
        `${API}/auth/verify-otp`,
        {
          email,
          otp,
        }
      );

      /*
      =========================================
      REGISTER USER
      =========================================
      */

      await axios.post(
        `${API}/auth/register`,
        {
          name,
          email,
          password,
          otp,
        }
      );

      alert(
        "Account created successfully"
      );

      /*
      =========================================
      RESET
      =========================================
      */

      setMode("signin");

      setStep("form");

      setOtp("");

    } catch (error: any) {

      console.log(error);

      if (
        error?.response?.data
      ) {

        alert(
          error.response.data
        );

      } else {

        alert(
          "Registration failed"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  /*
  =========================================
  LOGIN
  =========================================
  */

  const login = async () => {

    if (!email || !password) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await axios.post(
          `${API}/auth/login`,
          {
            email,
            password,
          }
        );

      /*
      =========================================
      SAVE AUTH
      =========================================
      */

      localStorage.setItem(
        "auth",
        JSON.stringify(
          response.data
        )
      );

      alert("Login successful");

      /*
      =========================================
      REDIRECT
      =========================================
      */

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        "Invalid credentials"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-orange-100 p-8">

        {/* ========================================= */}
        {/* LOGO */}
        {/* ========================================= */}

        <div className="flex flex-col items-center">

          <img
            src="/logo.png"
            alt="logo"
            className="w-24 h-24 rounded-[28px] shadow-lg object-cover"
          />

          <h1 className="text-5xl font-extrabold mt-6 bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent text-center">
            Grab A Bite
          </h1>

          <p className="text-center text-gray-500 mt-3 leading-relaxed">
            Smart Cafeteria
            <br />
            Pre-ordering System
          </p>

        </div>

        {/* ========================================= */}
        {/* FORM */}
        {/* ========================================= */}

        {
          step === "form" ? (

            <div className="mt-10 space-y-5">

              {
                mode === "signup" && (

                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-400 transition"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                  />
                )
              }

              <input
                type="email"
                placeholder="College Email"
                className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-400 transition"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-400 transition"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              {
                mode === "signin"
                ? (

                  <button
                    onClick={login}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-2xl p-4 font-bold text-lg hover:scale-[1.02] active:scale-[0.99] transition-all shadow-lg"
                  >
                    {
                      loading
                      ? "Please wait..."
                      : "Sign In"
                    }
                  </button>

                )
                : (

                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-2xl p-4 font-bold text-lg hover:scale-[1.02] active:scale-[0.99] transition-all shadow-lg"
                  >
                    {
                      loading
                      ? "Sending OTP..."
                      : "Generate OTP"
                    }
                  </button>

                )
              }

              {/* ========================================= */}
              {/* TOGGLE */}
              {/* ========================================= */}

              <div className="text-center pt-3">

                {
                  mode === "signin"
                  ? (

                    <button
                      onClick={() =>
                        setMode(
                          "signup"
                        )
                      }
                      className="text-orange-500 font-semibold hover:underline"
                    >
                      Don't have an account?
                      Sign Up
                    </button>

                  )
                  : (

                    <button
                      onClick={() => {

                        setMode(
                          "signin"
                        );

                        setStep(
                          "form"
                        );
                      }}
                      className="text-orange-500 font-semibold hover:underline"
                    >
                      Already have an account?
                      Sign In
                    </button>

                  )
                }

              </div>

            </div>

          ) : (

            <div className="mt-10 space-y-5">

              <h2 className="text-center text-3xl font-bold text-gray-800">
                Verify OTP
              </h2>

              <p className="text-center text-gray-500 leading-relaxed">
                OTP sent to
                <br />

                <span className="font-semibold text-gray-700">
                  {email}
                </span>
              </p>

              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border border-gray-200 rounded-2xl p-4 text-center text-2xl tracking-[10px] outline-none focus:ring-2 focus:ring-green-400 transition"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                  )
                }
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-2xl p-4 font-bold text-lg hover:scale-[1.02] active:scale-[0.99] transition-all shadow-lg"
              >
                {
                  loading
                  ? "Verifying..."
                  : "Verify OTP"
                }
              </button>

            </div>

          )
        }

      </div>

    </div>
  );
}
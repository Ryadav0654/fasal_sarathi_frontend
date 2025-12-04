import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { apiClient } from "../lib/api-client.js";
import { loginSuccess } from "../redux/slice/AuthSlice.js";
import { LOGIN_ROUTE } from "../utils/constrants.js";
import { Mail, Lock, ArrowRight, Sprout, Loader2 } from "lucide-react";

const Login = () => {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleLogin = async (userData) => {
    try {
      setloading(true);
      const { data, status } = await apiClient.post(LOGIN_ROUTE, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data && status === 200) {
        dispatch(loginSuccess(data.accessToken));
        toast.success(data.message);
        navigate("/");
      }
      reset();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error(error.message || "An error occurred");
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-black/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md p-8 mx-4">
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-300">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 text-green-400 mb-4 border border-green-500/30 shadow-lg shadow-green-900/20">
              <Sprout size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-green-100/80 text-sm">Sign in to continue to Fasal Sarathi</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-green-200/50 group-focus-within:text-green-400 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500/50 focus:bg-black/30 transition-all"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-green-200/50 group-focus-within:text-green-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500/50 focus:bg-black/30 transition-all"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-green-100/60 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-green-400 hover:text-green-300 font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

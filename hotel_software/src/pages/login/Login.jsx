import React from "react";
import { Link } from "react-router";

const Login = () => {
  return (
    <div className="card w-full max-w-xl shadow-2xl">
      <h1 className="text-4xl font-bold text-amber-800 text-center pt-6">
        Welcome Back
      </h1>

      <div className="card-body">
        <form>
          <fieldset className="fieldset">
            {/* Email */}
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full bg-white"
              placeholder="Email"
            />

            {/* Password */}
            <label className="label">Password</label>
            <input
              type="password"
              className="input input-bordered w-full bg-white"
              placeholder="Password"
            />

            {/* Forgot Password */}
            <div className="text-right">
              <a className="link link-hover text-sm text-gray-500">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn bg-amber-800 text-white border-none mt-5 hover:bg-amber-900"
            >
              LOG IN
            </button>
          </fieldset>
        </form>

        <p className="text-center mt-4">
          New to this website?{" "}
          <Link to="/signup" className="text-amber-800 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React from "react";
import { Link } from "react-router";

const Signup = () => {
  return (
    <div className="card  w-full max-w-xl shadow-2xl">
      <h1 className="text-4xl font-bold text-amber-800 text-center pt-6">
        Create an Account
      </h1>

      <div className="card-body">
        <form>
          <fieldset className="fieldset">
            {/* Name */}
            <label className="label">Your Name</label>
            <input
              type="text"
              className="input input-bordered w-full bg-white"
              placeholder="Your Name"
            />

            {/* Profile Picture */}
            <label className="label">Profile Picture</label>
            <input
              type="file"
              className="file-input file-input-bordered w-full bg-white"
            />

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

            {/* Signup Button */}
            <button
              type="submit"
              className="btn bg-amber-800 text-white border-none mt-5 hover:bg-amber-900"
            >
              SIGN UP
            </button>
          </fieldset>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-amber-800 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import React from "react";
import { Outlet } from "react-router";
import authImg from "/authImage.png";
import Logo from "../components/Logo";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-white">
      {/* Logo */}
      <div className="max-w-7xl mx-auto px-8 pt-8 flex justify-center">
        <Logo />
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid lg:grid-cols-2 items-center gap-16">
          {/* Left */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-amber-100 rounded-3xl blur-3xl opacity-40"></div>

              <img
                src={authImg}
                alt="Hotel"
                className="relative w-full h-130  max-w-xl rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center h-130">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

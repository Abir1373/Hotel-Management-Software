import React from "react";
import logo from "/logo.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/">
      <div className="flex items-end">
        <img
          className="mb-2"
          src={logo}
          alt=""
          className="w-35 h-32 object-contain"
        />
        {/* <p className="text-4xl -ml-2 font-extrabold">Demon's Cave</p> */}
      </div>
    </Link>
  );
};

export default Logo;

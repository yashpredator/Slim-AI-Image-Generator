import React from "react";
import logo from "../assets/openAI.svg";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="flex flex-row bg-slate-300 p-5 justify-between">
      <Link to="/">
        <div className="w-32">
          <img src={logo} alt="No logo" />
        </div>
      </Link>
      <div>
        <Link to="/create">
          <button className="bg-violet-500 py-1 rounded-lg px-2 text-white font-serif">
            Create
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const Ai = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200">
      <Link to="/digitalVersion">
        <img
          src="/images/logo.png"
          alt="AI Assistant"
          width={50}
          height={50}
        />
      </Link>
    </div>
  );
};

export default Ai;

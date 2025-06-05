"use client";
import React from "react";

const Loader: React.FC = () => (
  <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-opacity-50 flex items-center justify-center z-500">
    <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default Loader;

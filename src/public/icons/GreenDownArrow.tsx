import React from "react";

const GreenDownArrow: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 20 20"
    {...props}
  >
    <g transform="rotate(90 10 10)">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
        clipRule="evenodd"
      />
    </g>
  </svg>
);

export default GreenDownArrow;
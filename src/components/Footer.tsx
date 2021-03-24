import React from "react";

export const Footer = () => {
  return (
    <footer className="text-center shadow-inner p-2 text-sm text-gray-700">
      <a
        href="https://www.github.com/everettblakley/parcel-tracker-react"
        title="source code"
      >
        Check out the code on Github
      </a>
      <p className="italic">
        &copy; Copyright {new Date().getFullYear()} -{" "}
        <a className="text-blue-600 underline" href="https:/everettblakley.ca">Everett Blakley</a>
      </p>
    </footer>
  );
};

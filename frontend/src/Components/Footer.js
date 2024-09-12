import React from "react";

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-white text-center">
      <div className="container">
        <span className="text-muted">
          {" "}
          Copyright © <span id="year"></span>{" "}
        </span>
      </div>
    </footer>
  );
};

export default Footer;

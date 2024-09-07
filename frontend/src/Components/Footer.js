import React from "react";

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-white text-center">
      <div className="container">
        <span className="text-muted">
          {" "}
          Copyright © <span id="year"></span>{" "}
          <a href="javascript:void(0);" className="text-dark fw-medium">
            Udon
          </a>
          . Designed with <span className="bi bi-heart-fill text-danger"></span>{" "}
          by{" "}
          <a href="javascript:void(0);">
            <span className="fw-medium text-primary text-decoration-underline">
              Spruko
            </span>
          </a>{" "}
          All rights reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;

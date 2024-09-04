import React from "react";

const CdNav = () => {
  return (
    <nav className="cd-nav-container" id="cd-nav">
      <header>
        <h3>Navigation</h3>
        <a href="#0" className="cd-close-nav">
          Close
        </a>
      </header>
      <ul className="cd-nav list-unstyled">
        <li className="cd-selected" data-menu="index">
          <a href="/#">
            <span>
              <i className="glyphicon glyphicon-home"></i>
            </span>
            <p>Dashboard2</p>
          </a>
        </li>
        <li data-menu="profile">
          <a href="/#">
            <span>
              <i className="glyphicon glyphicon-user"></i>
            </span>
            <p>Profile</p>
          </a>
        </li>
        <li data-menu="inbox">
          <a href="/#">
            <span>
              <i className="glyphicon glyphicon-envelope"></i>
            </span>
            <p>Mailbox</p>
          </a>
        </li>
        <li data-menu="#">
          <a href="/#">
            <span>
              <i className="glyphicon glyphicon-tasks"></i>
            </span>
            <p>Tasks</p>
          </a>
        </li>
        <li data-menu="#">
          <a href="/#">
            <span>
              <i className="glyphicon glyphicon-cog"></i>
            </span>
            <p>Settings</p>
          </a>
        </li>
        <li data-menu="calendar">
          <a href="/#">
            <span>
              <i className="glyphicon glyphicon-calendar"></i>
            </span>
            <p>Calendar</p>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default CdNav;

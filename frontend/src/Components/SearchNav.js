import React from "react";

const SearchNav = () => {
  return (
    <>
      <div className="overlay"></div>
      <nav
        className="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-right"
        id="cbp-spmenu-s1"
      >
        <h3>
          <span className="pull-left">Chat</span>
          <a href="#chat" className="pull-right" id="closeRight">
            <i className="fa fa-times"></i>
          </a>
        </h3>
        <div className="slimscroll">
          <a href="#chat" className="showRight2">
            <img src="/assets/images/avatar7.png" alt="" />
            <span>
              Alisha Abdoola<small>Hi! How're you?</small>
            </span>
          </a>
          <a href="#chat" className="showRight2">
            <img src="/assets/images/avatar3.png" alt="" />
            <span>
              Feroza Limalia<small>Hi! How're you?</small>
            </span>
          </a>
          <a href="#chat" className="showRight2">
            <img src="/assets/images/avatar4.png" alt="" />
            <span>
              Julius Idana<small>Hi! How're you?</small>
            </span>
          </a>
          <a href="#chat" className="showRight2">
            <img src="/assets/images/avatar5.png" alt="" />
            <span>
              David Horwitz<small>Hi! How're you?</small>
            </span>
          </a>
          <a href="#chat" className="showRight2">
            <img src="/assets/images/avatar2.png" alt="" />
            <span>
              Robin Bayhack<small>Hi! How're you?</small>
            </span>
          </a>
        </div>
      </nav>
      <nav
        className="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-right"
        id="cbp-spmenu-s2"
      >
        <h3>
          <span className="pull-left">Robin Bayhack</span>
          <a href="#chat" className="pull-right" id="closeRight2">
            <i className="fa fa-angle-right"></i>
          </a>
        </h3>
        <div className="slimscroll chat">
          <div className="chat-item chat-item-left">
            <div className="chat-image">
              <img src="/assets/images/avatar2.png" alt="" />
            </div>
            <div className="chat-message">Hi There!</div>
          </div>
          <div className="chat-item chat-item-right">
            <div className="chat-message">Hi!</div>
          </div>
          <div className="chat-item chat-item-left">
            <div className="chat-image">
              <img src="/assets/images/avatar2.png" alt="" />
            </div>
            <div className="chat-message">
              Can you please get back to me about that Standard Bank account I
              asked about yesterday?
            </div>
          </div>
          <div className="chat-item chat-item-right">
            <div className="chat-message">
              Account BL465065 of TERENCE CLIVE RASMUS ?
            </div>
          </div>
          <div className="chat-item chat-item-left">
            <div className="chat-image">
              <img src="/assets/images/avatar2.png" alt="" />
            </div>
            <div className="chat-message">Yes</div>
          </div>
          <div className="chat-item chat-item-right">
            <div className="chat-message">
              I will follow up and get back to you shortly.
            </div>
          </div>
          <div className="chat-item chat-item-left">
            <div className="chat-image">
              <img src="/assets/images/avatar2.png" alt="" />
            </div>
            <div className="chat-message">Thanks Alisha</div>
          </div>
        </div>
        <div className="chat-write">
          <form className="form-horizontal" action="">
            <input
              type="text"
              className="form-control"
              placeholder="Say something"
            />
          </form>
        </div>
      </nav>
      <form className="search-form" action="#" method="GET">
        <div className="input-group">
          <input
            type="text"
            name="search"
            className="form-control search-input"
            placeholder="Search..."
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default close-search waves-effect waves-button waves-classic"
              type="button"
            >
              <i className="fa fa-times"></i>
            </button>
          </span>
        </div>
      </form>
    </>
  );
};

export default SearchNav;

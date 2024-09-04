import React from "react";
import { useAuth } from "../context/useAuth";

const Home = (props) => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <div id="homepage">
        <main className="page-content shadow-none">
          <div className="page-inner">
            <div id="main-wrapper">
              <div className="container">
                <div
                  className={`row mt-[50px] ${
                    isLoggedIn() ? "md:mt-[5px]" : "md:mt-[20px]"
                  }`}
                >
                  <h3 className="ml-6 text-xl">Home</h3>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

import React from "react";
import { useAuth } from "../context/useAuth";

const Home = (props) => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <div id="homepage">
        <h3 className="text-xl">Home</h3>
      </div>
    </>
  );
};

export default Home;

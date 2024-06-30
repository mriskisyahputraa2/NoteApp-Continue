import React from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1 className="title has-text-dark">Dashboard</h1>
      <h2 className="subtitle has-text-dark">
        Welcome <strong className="has-text-dark ">{user && user.name}</strong>
      </h2>
    </div>
  );
};
export default Welcome;

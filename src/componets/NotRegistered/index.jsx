import React from "react";
import s from "./NotRegistered.module.scss";
import { useNavigate } from "react-router-dom";

const NotRegistered = () => {
  const navigate = useNavigate();
  return (
    <div className={s.root}>
      <div>
        <h1>if you want to play you must be registered</h1>
        <button onClick={() => navigate("/")}>Click here</button>
      </div>
    </div>
  );
};

export default NotRegistered;

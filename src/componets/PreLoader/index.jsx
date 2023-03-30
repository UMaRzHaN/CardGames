import React from "react";
import s from "./Preloader.css"

const PreLoader = () => {
  return (
    <div  id="loaderwrapper">
      <div id="loader5" className={s.loaderbox}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default PreLoader;

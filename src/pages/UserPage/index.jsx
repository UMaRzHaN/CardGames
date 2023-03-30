import { React, useState } from "react";
import ModalSettings from "../../componets/ModalSettings";
import s from "./UserPage.module.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const UserPage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pass, setPass] = useState("");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const verification = () => {
    if (pass === user.password) {
      setShow(true);
    } else toast.error("not correct");
  };
  const forgot = () => {
    navigate("/register");
  };
  const disp = () => (
    <div className={s.user_parent}>
      <ModalSettings
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      ></ModalSettings>
      <div className={s.user_pic}>
        <span className={s.user_span}>
          <img
            className={s.user_img}
            src="https://www.computerhope.com/jargon/g/guest-user.png"
            alt="error"
          />
          <h1>{user.name}</h1>
        </span>
        <button
          onClick={() => {
            setIsVisible(true);
          }}
          className={s.user_settings}
        >
          settings
        </button>
        <button
          className={s.user_settings}
          onClick={() => navigate("/klondike")}
        >
          klondike
        </button>
        <button className={s.user_settings} onClick={() => navigate("/modal")}>
          durak
        </button>
      </div>
    </div>
  );
  return show || localStorage.getItem("pass") !== null ? (
    disp()
  ) : (
    <div className={s.user_form}>
      <input
        type="password"
        className={s.user_pass}
        onChange={(e) => setPass(e.target.value)}
      />
      <button className={s.user_settings} onClick={verification}>
        claim
      </button>
      <button className={s.user_settings} onClick={forgot}>
        forgot password?
      </button>
    </div>
  );
};

export default UserPage;

import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ValidationPass } from "../../assets/validations";
import s from "./ModalSettings.module.scss";

const ModalSettings = ({ isVisible, setIsVisible }) => {
  const userInfo = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [user, SetUser] = useState(userInfo);
  const [correctPass, setCorrectPass] = useState(false);
  function typePass(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      result += "*";
    }
    return result;
  }
  const pass = typePass(userInfo.password);
  return (
    <div
      className={isVisible ? s.root : s.hide}
      onClick={() => {
        setIsVisible(false);
        setEdit(false);
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={s.child}
      >
        <h1> Profile</h1>
        <div className={s.block}>
          <div className={s.left}>
            <h2 className={s.gray}>Username: </h2>
            <h2 className={s.gray}>Password: </h2>
          </div>
          <div className={s.right}>
            <h2
              contentEditable={edit}
              suppressContentEditableWarning={true}
              onInput={(e) =>
                SetUser({
                  ...user,
                  name: e.currentTarget.textContent,
                })
              }
              style={
                edit ? { border: "2px solid   #229091", width: "100%" } : {}
              }
            >
              {userInfo.name}
            </h2>
            <h2
              contentEditable={edit}
              suppressContentEditableWarning={true}
              onKeyUp={(event) =>
                setCorrectPass(ValidationPass(event.currentTarget.textContent))
              }
              onInput={(e) =>
                SetUser({
                  ...user,
                  password: e.currentTarget.textContent,
                })
              }
              style={edit ? { border: "2px solid #229091", width: "100%" } : {}}
            >
              {edit ? userInfo.password : pass}
            </h2>
          </div>
        </div>
        <button
          onClick={() => {
            if (!edit) {
              setEdit(true);
            } else {
              if (correctPass) {
                axios.patch("http://localhost:4000/Users/" + userInfo.id, user);
                localStorage.setItem("user", JSON.stringify(user));
                setEdit(false);
                setIsVisible(false);
                navigate("/user:", {
                  state: user,
                });
              } else toast.error(user.password + " is not good enough");
            }
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ModalSettings;

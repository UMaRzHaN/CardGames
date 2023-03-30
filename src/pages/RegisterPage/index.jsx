import React, { useState } from "react";
import s from "./RegisterPage.module.scss";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ValidationPass, validate_Email } from "../../assets/validations";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [correctPass, setCorrectPass] = useState(false);
  const [user, SetUser] = useState({
    email: "",
    name: "",
    password: "",
    id: "",
  });

  const GameStart = async (user) => {
    axios.post("http://localhost:4000/Users", user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <div className={s.reg_parent}>
      <main className={s.reg_main}>
        <div className={s.reg_circle}></div>
        <div className={s.register_form_container}>
          <h2 className={s.reg_page}>Registration page</h2>
          <h1 className={s.reg_title}>registration for gaming</h1>
          <div className={s.reg_fields}>
            <div className={s.reg_field}>
              <input
                type="email"
                placeholder="email"
                onChange={(event) =>
                  SetUser({
                    ...user,
                    email: event.target.value,
                  })
                }
              />
            </div>
            <div className={s.reg_field}>
              <input
                type="text"
                placeholder="name"
                onChange={(event) =>
                  SetUser({
                    ...user,
                    name: event.target.value,
                  })
                }
              />
            </div>
            <div className={s.reg_field}>
              <input
                type="text"
                placeholder="password"
                onKeyUp={(event) =>
                  setCorrectPass(ValidationPass(event.target.value))
                }
                onChange={(event) =>
                  SetUser({
                    ...user,
                    password: event.target.value,
                  })
                }
              />
            </div>
            <div className={s.reg_buttons}>
              <button
                className={s.reg_button}
                onClick={() => {
                  if (
                    user.name.length === 0 ||
                    user.password.length === 0 ||
                    user.email.length === 0
                  ) {
                    toast.error("fill the blank");
                  } else if (correctPass && user.password.length > 0) {
                    if (validate_Email(user.email)) {
                      toast.success(user.email + " is valid Password :)");
                      const uiid = uuidv4();
                      GameStart(user);
                      navigate("/user:", {
                        state: {
                          name: user.name,
                          password: user.password,
                          id: uiid,
                        },
                      });
                    } else
                      toast.error(user.email + " is not valid Password :(");
                  } else toast.error("create a strong password");
                }}
              >
                let's go play
              </button>
              <button
                onClick={() => navigate("/enter")}
                className={s.reg_button}
              >
                Already have an account?
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;

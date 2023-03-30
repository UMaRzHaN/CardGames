import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Enter.module.scss"
const EnterUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({ name: "", password: "", email: "" });

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await axios.get("http://localhost:4000/Users");
      setUsers(data);
    }
    fetchUsers();
  }, []);
  const validation = () => {
    if (users.some((e) => e.email === user.email)) {
      let UserInBack;
      users.forEach((element) => {
        if (element.name === user.name && element.password === user.password) {
          UserInBack = {
            email: element.email,
            password: element.password,
            name: element.name,
            id: element.id,
          };
        }
      });
      if (
        user.password === UserInBack.password &&
        UserInBack.name === user.name
      ) {
        navigate("/user:", {
          state: {
            name: UserInBack.name,
            password: UserInBack.password,
            id: UserInBack.id,
          },
        });
        localStorage.setItem("user", JSON.stringify(UserInBack ));
      } else alert("Неправильно введены данные");
    }
  };
  return (
    <div>
      <input
        type="email"
        placeholder="email"
        onChange={(event) =>
          setUser({
            ...user,
            email: event.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="name"
        onChange={(event) =>
          setUser({
            ...user,
            name: event.target.value,
          })
        }
      />
      <input
        type="password"
        placeholder="password"
        onChange={(event) =>
          setUser({
            ...user,
            password: event.target.value,
          })
        }
      />
      <button className={s.enterbtn} onClick={validation}>Claim</button>
    </div>
  );
};

export default EnterUser;

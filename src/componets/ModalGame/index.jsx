import { React, useEffect, useState } from "react";
import s from "./ModalGame.module.scss";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { handleDragOver } from "../../assets/handlers";

const ModalGame = () => {
  const navigate = useNavigate();
  const [arrRooms, setArrRooms] = useState([]);

  const [room, setRoom] = useState({
    roomID: uuidv4(),
    mode: "52",
  });
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:4000/Rooms");
      setArrRooms(data);
    };
    fetchData();
  }, []);
  const creatingRoom = (isAdmin) => {
    if (isAdmin === true) {
      axios.post("http://localhost:4000/Rooms", {
        mode: room.mode,
        id: room.roomID,
      });
      navigate(`/game/${room.roomID}`);
    } else if (isAdmin === false) {
      if (arrRooms.some((e) => e.id === room.roomID)) {
        const { id } =
          arrRooms[arrRooms.findIndex(({ id }) => id === room.roomID)];
        if (id === room.roomID) {
          navigate(`/game/${room.roomID}`);
        }
      } else toast.error(room.roomID + " is not valid");
    }
  };
  return (
    <>
      <div className={s.mod_parent}>
        <form className={s.form} onSubmit={handleDragOver}>
          <h2 className={s.mod_h}>Room Page</h2>
          <p className={s.mod_p}>
            <input
              placeholder="RoomId"
              type="text"
              onChange={(e) => setRoom({ ...room, roomID: e.target.value })}
            />
          </p>
          <select onChange={(e) => setRoom({ ...room, mode: e.target.value })}>
            <option value="52">52</option>
            <option value="36">36</option>
            <option value="24">24</option>
          </select>
          <button onClick={() => creatingRoom(false)}>JOIN</button>

          <button onClick={() => creatingRoom(true)}>CREATE</button>
        </form>
      </div>
    </>
  );
};

export default ModalGame;

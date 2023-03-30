import { React, useEffect, useMemo, useState } from "react";
import Playercards from "../../componets/Playercards";
import CardStock from "../../componets/CardStock";
import PlayCards from "../../componets/PlayCards";

import s from "./GamePage.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Game_Start } from "../../redux/reducers/durak";
import PreLoader from "../../componets/PreLoader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Start } from "../../assets/rules";
import { copyToClipboard } from "../../assets/handlers";
import { useParams } from "react-router-dom";
import NotRegistered from "../../componets/NotRegistered";

// import { fetchCards } from "../../redux/action";

import io from "socket.io-client";
let socket;
const GamePage = () => {
  // const [showBtn_Res, setShowBtn_Res] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [showMod, setShowMod] = useState(false);
  const [RoomFull, setRoomFull] = useState(false);
  const [GameMode, setGameMode] = useState(null);

  const [Rooms, setRooms] = useState([]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const name = user ? user.name : null;
  useMemo(() => {
    if (name !== null) {
    } else {
      setShowMod(true);
    }
  }, [name]);
  useMemo(() => {
    if (RoomFull === false) {
      const connectionOptions = {
        forceNew: true,
        reconnectionAttempts: "Infinity",
        timeout: 10000,
        transports: ["websocket"],
      };
      socket = io.connect("http://localhost:" + 5000, connectionOptions);
      if (name) {
        socket.emit("join", { player: name, id: roomCode }, (error) => {
          if (error) {
            setRoomFull(true);
          }
        });
      }
      // cleanup on component unmount
      return function cleanup() {
        socket.emit("disc");
        //shut down connnection instance
        socket.off();
      };
    } else {
      setTimeout(() => {
        navigate("/user:");
      }, 3000);
      toast.error("Room is full");
    }
  }, [roomCode, name, RoomFull, navigate]);
  console.log(players);
  useMemo(() => {
    if (players.length === 2 && !RoomFull) {
      toast.success("Now you can start");
    }
  }, [players, RoomFull]);
  const received = useSelector((state) => state.cards);
  const [showStartBtn, setShowStartBtn] = useState(true);
  const [End, setEnd] = useState(false);

  const [receivedId, setReceivedId] = useState(1);
  useEffect(() => {
    async function Rooms() {
      const { data } = await axios.get("http://localhost:4000/Rooms");
      setRooms(data);
    }
    Rooms();
  }, []);
  // const Restart = () => {
  //   const res = async () => {
  //     await dispatch(fetchCards());
  //   };
  //   res();
  //   let bool =
  //     received.cards.db.length === 0 &&
  //     received.players.player1.deck.length === 0
  //       ? received.players.player2.move
  //       : received.players.player1.move;
  //   setShowBtn_Res(false);
  //   const db = Start({ ...received }, bool, GameMode, players, name);
  //   dispatch(Game_Start(db));
  //   socket.emit("start", { data: db });
  //   socket.emit("win", roomCode);
  // };
  const startBtn = () => {
    if (players.length === 2) {
      const Room = Rooms[Rooms.findIndex(({ id }) => id === roomCode)];
      setGameMode(Room.mode);
      // if (Rooms.some(({ id }) => id === roomCode)) {
      //   axios.delete("http://localhost:4000/Rooms/" + roomCode);
      // }
      const db = Start(
        { ...received },
        Boolean(Math.round(Math.random())),
        GameMode ? GameMode : Room.mode,
        players,
        name
      );
      const message = "game started";
      toast.success(message);
      dispatch(Game_Start(db));
      setShowStartBtn(false);
      socket.emit("start", { data: db, message, roomCode });
    } else toast.error("wait another player or refresh this page");
  };
  const quit = (receivedId) => {
    if (receivedId === 2) {
      toast.error(name + " has quit");
      setTimeout(() => {
        navigate("/user:");
      }, 5000);
      socket.emit("send msg", {
        message: name + " has quit",
        data: received,
        id: 1,
        roomCode,
      });
      // socket.emit("disc");
    } else {
      toast.error(name + " has quit");
      setTimeout(() => {
        navigate("/user:");
      }, 5000);
      socket.emit("send msg", {
        message: name + " has quit",
        data: received,
        id: 2,
        roomCode,
      });
      setEnd(true);
      axios.delete("http://localhost:4000/Rooms/" + roomCode);
      // socket.emit("disc");
    }
  };
  useEffect(() => {
    if (End) {
      toast.success("game ended");
    }
  }, [End]);

  useEffect(() => {
    socket.on("receive", ({ data, from, message }) => {
      dispatch(Game_Start(data));
      setReceivedId(from);
      setShowStartBtn(false);
      if (message !== undefined) {
        if (message === "game started") {
          toast.success(message);
        } else {
          setTimeout(() => {
            navigate("/user:");
          }, 5000);
          setEnd(true);
          toast.error(message);
        }
      }
    });
  }, [dispatch, navigate]);

  useEffect(() => {
    socket.on("roomData", ({ users, bool }) => {
      setPlayers([...users]);
      if (bool) {
        setShowStartBtn(true);
      }
    });
  }, [roomCode]);
  useEffect(() => {
    if (
      received.cards.db.length === 0 &&
      received.players.player1.deck.length === 0 &&
      received.deck.player1.length === 0 &&
      received.cards.trumpCard !== undefined &&
      received.players.player1.move !== null
    ) {
      toast.success(received.players.player1.name + " wins!!!");
      axios.delete("http://localhost:4000/Rooms/" + roomCode);
      setEnd(true);
      setTimeout(() => {
        navigate("/user:");
      }, 5000);
      // setShowBtn_Res(true);
      // setShowStartBtn(true);
    } else if (
      received.cards.db.length === 0 &&
      received.players.player2.deck.length === 0 &&
      received.deck.player2.length === 0 &&
      received.cards.trumpCard !== undefined &&
      received.players.player2.move !== null
    ) {
      toast.success(received.players.player2.name + " wins!!!");
      axios.delete("http://localhost:4000/Rooms/" + roomCode);
      setEnd(true);
      setTimeout(() => {
        navigate("/user:");
      }, 5000);
      // setShowBtn_Res(true);
      // setShowStartBtn(true);
    }
  }, [received, players, navigate, roomCode]);

  if (received.loadingStatus) {
    return <PreLoader />;
  }
  if (showMod) {
    return <NotRegistered />;
  }
  if (RoomFull) {
    return <h1>Sorry, but this game is already full</h1>;
  }
  return (
    <>
      <div className={s.root}>
        {showStartBtn ? (
          <button className={s.btnstart} onClick={startBtn}>
            Start
          </button>
        ) : (
          ""
        )}
        {!showStartBtn ? (
          <button className={s.btnstart} onClick={() => quit(receivedId)}>
            Quit
          </button>
        ) : (
          ""
        )}

        <div className={s.player}>
          {/* Имя пользователя при регистрации */}
          <div className={s.nickname}>{received.players.player1.name}</div>

          <div className={s.turn}>
            {received.players.player1.move === true
              ? "Я хожу"
              : received.players.player1.move === false
              ? "Вам крыться"
              : ""}
          </div>
          {/* уведомление о том чья очередь ходить */}

          <Playercards
            Deck={received.deck}
            Players={received.players}
            className={s.cards}
            id={1}
            socket={socket}
            received={receivedId}
            roomCode={roomCode}
          />
        </div>

        <div className={s.desk}>
          <CardStock className={s.card_stock} />
          <div className={s.play_cards}>
            <PlayCards Deck={received.deck} id={1} />
            <PlayCards Deck={received.deck} id={2} />
          </div>
        </div>
        <div className={s.player}>
          {/* Имя пользователя при регистрации */}
          <div className={s.nickname}>{received.players.player2.name}</div>

          <div className={s.turn}>
            {received.players.player2.move === true
              ? "Я хожу"
              : received.players.player2.move === false
              ? "Вам крыться"
              : ""}
          </div>
          {/* уведомление о том чья очередь ходить */}

          <Playercards
            Deck={received.deck}
            Players={received.players}
            className={s.cards}
            id={2}
            socket={socket}
            received={receivedId}
            roomCode={roomCode}
          />
        </div>

        {/* <button
          style={
            showBtn_Res
              ? { display: "block", top: "100px" }
              : { display: "none" }
          }
          className={s.linkbtn}
          onClick={Restart}
        >
          Restart
        </button> */}
        <button className={s.linkbtn} onClick={() => copyToClipboard(roomCode)}>
          copy roomCode
        </button>
      </div>
    </>
  );
};

export default GamePage;

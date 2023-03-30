import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PreLoader from "../../componets/PreLoader";
import "react-toastify/dist/ReactToastify.css";
import defaultIMG from "../../img/default.png";
import { fetchCards } from "../../redux/action";
import {
  Click,
  Column,
  SelectingCardsformData,
  Start,
  Undo,
} from "../../redux/reducers/klondike";
import s from "./Klondike.module.scss";
import shuffle from "../../assets/shuffle";
import {
  card,
  column,
  handleDragOver,
  handleDragStart,
} from "../../assets/handlers";

const Klondike = () => {
  const dispatch = useDispatch();
  const Game_Start = (e) => {
    setGameMode(e.target.textContent);
    dispatch(
      Start(
        shuffle([...klondike.cards]).map((e) =>
          e.number === 14 ? { ...e, number: 1 } : e
        )
      )
    );
    for (let i = 0; i < sessionStorage.length; i++) {
      sessionStorage.removeItem(sessionStorage.key(i));
    }
    setShow(false);
  };
  function handleCompleted(e) {
    const catched = e.dataTransfer.getData("card").split(",");
    const card = {
      suit: catched[2],
      number: Number(catched[1]),
      name: catched[4],
      selected: true,
      img: catched[3],
      id: Number(catched[6]),
      color: catched[0],
    };
    dispatch(Click(card));
  }
  const click = (e) => (e.selected ? dispatch(Click(e)) : {});
  function handleContainers(e) {
    const catched = e.dataTransfer.getData("card").split(",");
    const lastCard = e.target.id.split(",");
    const colum = e.target.id.split(",")[7];
    const card = {
      suit: catched[2],
      number: Number(catched[1]),
      name: catched[4],
      selected: true,
      img: catched[3],
      id: Number(catched[6]),
      color: catched[0],
    };
    const contain = {
      suit: lastCard[2],
      number: Number(lastCard[1]),
      name: lastCard[4],
      selected: true,
      img: lastCard[3],
      id: Number(lastCard[6]),
      color: lastCard[0],
    };
    if (
      lastCard.length !== 1 &&
      card.number === contain.number - 1 &&
      card.color !== contain.color &&
      !!colum
    ) {
      dispatch(Column({ card, colum }));
    } else if (
      lastCard.length === 1 &&
      card.number === 13 &&
      isNaN(contain.id)
    ) {
      dispatch(Column({ card, colum: lastCard[0] }));
    }
  }

  const klondike = useSelector((state) => state.klondike);
  const { start, move, cards, columns, completed, selected, scores } =
    useSelector((state) => state.klondike);

  const [show, setShow] = useState(true);
  const [gameMode, setGameMode] = useState("");

  useEffect(() => {
    if (
      completed.clovers.length === 13 &&
      completed.pikes.length === 13 &&
      completed.diamonds.length === 13 &&
      completed.hearts.length === 13
    ) {
      toast.success("you win!!!");
    }
  }, [completed]);
  useEffect(() => {
    if (start) {
      sessionStorage.setItem(
        "klondike" + move,
        JSON.stringify({ cards, columns, completed, selected, scores })
      );
    }
  }, [move, start, cards, columns, completed, selected, scores]);

  const disp = () => (
    <div className={s.parent}>
      <div className={s.scores} draggable={false}>
        Scores: {klondike.scores}
      </div>
      <button
        className={s.undo}
        onClick={() => {
          if (move !== 0) {
            dispatch(
              Undo(JSON.parse(sessionStorage.getItem("klondike" + (move - 1))))
            );
            sessionStorage.removeItem("klondike" + (move - 1));
          }
        }}
      >
        Undo
      </button>
      <button
        className={s.res}
        onClick={() => {
          dispatch(fetchCards());
          setShow(true);
        }}
      >
        Restart
      </button>
      <div className={s.cards}>
        <div className={s.allCards}>
          <img
            alt=""
            src={defaultIMG}
            onClick={() => dispatch(SelectingCardsformData(gameMode))}
            draggable={false}
            style={
              klondike.cards.length !== 0
                ? { opacity: 1, cursor: "pointer" }
                : { opacity: 0.25 }
            }
          />
          <div className={s.selectedOne}>
            {!!klondike.selected.slice(-1)[0] && gameMode === "Easy" ? (
              <img
                onClick={() => dispatch(Click(klondike.selected.slice(-1)[0]))}
                src={klondike.selected.slice(-1)[0].img}
                id={card(klondike.selected.slice(-1)[0])}
                alt=""
                onDragStart={handleDragStart}
                draggable={true}
                style={{ cursor: "grab" }}
              />
            ) : !!klondike.selected.slice(-1)[0] && gameMode === "Hard" ? (
              klondike.selected.map((e, index) => (
                <img
                  onClick={() =>
                    index === klondike.selected.length - 1
                      ? dispatch(Click(e))
                      : {}
                  }
                  src={e.img}
                  alt=""
                  id={card(e)}
                  key={index}
                  onDragStart={handleDragStart}
                  draggable={
                    index === klondike.selected.length - 1 ? true : false
                  }
                  style={
                    index + 1 > klondike.selected.length - 3 &&
                    index + 1 < klondike.selected.length
                      ? { display: "inline" }
                      : index + 1 === klondike.selected.length
                      ? { cursor: "grab" }
                      : { display: "none" }
                  }
                />
              ))
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={s.completed}>
          <div
            className={s.colums}
            id={s.clovers}
            onDragOver={handleDragOver}
            onDrop={handleCompleted}
            style={
              klondike.completed.clovers.length === 0
                ? { opacity: "0.25" }
                : { opacity: "1", background: "none" }
            }
          >
            {klondike.completed.clovers.map((e, index) => (
              <img
                alt=""
                src={e.img}
                id={card(klondike.completed.clovers[index])}
                onDragStart={handleDragStart}
                draggable={true}
                key={index}
              />
            ))}
          </div>
          <div
            className={s.colums}
            id={s.hearts}
            onDragOver={handleDragOver}
            onDrop={handleCompleted}
            style={
              klondike.completed.hearts.length === 0
                ? { opacity: "0.25" }
                : { opacity: "1", background: "none" }
            }
          >
            {klondike.completed.hearts.map((e, index) => (
              <img
                src={e.img}
                alt=""
                id={card(klondike.completed.hearts[index])}
                draggable={true}
                onDragStart={handleDragStart}
                key={index}
              />
            ))}
          </div>
          <div
            className={s.colums}
            id={s.pikes}
            onDragOver={handleDragOver}
            onDrop={handleCompleted}
            style={
              klondike.completed.pikes.length === 0
                ? { opacity: "0.25" }
                : { opacity: "1", background: "none" }
            }
          >
            {klondike.completed.pikes.map((e, index) => (
              <img
                src={e.img}
                alt=""
                id={card(klondike.completed.pikes[index])}
                draggable={true}
                onDragStart={handleDragStart}
                key={index}
              />
            ))}
          </div>
          <div
            className={s.colums}
            id={s.diamonds}
            onDragOver={handleDragOver}
            onDrop={handleCompleted}
            style={
              klondike.completed.diamonds.length === 0
                ? { opacity: "0.25" }
                : { opacity: "1", background: "none" }
            }
          >
            {klondike.completed.diamonds.map((e, index) => (
              <img
                alt=""
                src={e.img}
                id={card(klondike.completed.diamonds[index])}
                draggable={true}
                onDragStart={handleDragStart}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={s.deck}>
        <div
          className={s.containers}
          onDragOver={handleDragOver}
          onDrop={handleContainers}
          id={column(klondike.columns.first, "first")}
        >
          {klondike.columns.first.map((e, index) => (
            <img
              src={e.selected ? e.img : defaultIMG}
              alt=""
              id={card(klondike.columns.first[index])}
              key={index}
              draggable={e.selected}
              onDragStart={handleDragStart}
              onClick={() => click(e)}
              style={e.selected ? { cursor: "grab" } : {}}
            />
          ))}
          <div alt="" draggable={false}></div>
        </div>
        <div
          className={s.containers}
          onDragOver={handleDragOver}
          onDrop={handleContainers}
          id={column(klondike.columns.second, "second")}
        >
          {klondike.columns.second.map((e, index) => (
            <img
              src={e.selected ? e.img : defaultIMG}
              alt=""
              id={card(klondike.columns.second[index])}
              key={index}
              draggable={e.selected}
              onDragStart={handleDragStart}
              onClick={() => click(e)}
              style={e.selected ? { cursor: "grab" } : {}}
            />
          ))}
        </div>
        <div
          className={s.containers}
          onDragOver={handleDragOver}
          onDrop={handleContainers}
          id={column(klondike.columns.third, "third")}
        >
          {klondike.columns.third.map((e, index) => (
            <img
              src={e.selected ? e.img : defaultIMG}
              alt=""
              id={card(klondike.columns.third[index])}
              key={index}
              draggable={e.selected}
              onDragStart={handleDragStart}
              onClick={() =>
                e.selected ? dispatch(Click(klondike.columns.third[index])) : {}
              }
              style={e.selected ? { cursor: "grab" } : {}}
            />
          ))}
        </div>
        <div
          className={s.containers}
          onDragOver={handleDragOver}
          onDrop={handleContainers}
          id={column(klondike.columns.fourth, "fourth")}
        >
          {klondike.columns.fourth.map((e, index) => (
            <img
              src={e.selected ? e.img : defaultIMG}
              alt=""
              id={card(klondike.columns.fourth[index])}
              key={index}
              draggable={e.selected}
              onDragStart={handleDragStart}
              onClick={() => click(e)}
              style={e.selected ? { cursor: "grab" } : {}}
            />
          ))}
        </div>
        <div
          className={s.containers}
          onDragOver={handleDragOver}
          onDrop={handleContainers}
          id={column(klondike.columns.fifth, "fifth")}
        >
          {klondike.columns.fifth.map((e, index) => (
            <img
              src={e.selected ? e.img : defaultIMG}
              alt=""
              id={card(klondike.columns.fifth[index])}
              key={index}
              draggable={e.selected}
              onDragStart={handleDragStart}
              onClick={() => click(e)}
              style={e.selected ? { cursor: "grab" } : {}}
            />
          ))}
        </div>
        <div
          className={s.containers}
          onDragOver={handleDragOver}
          onDrop={handleContainers}
          id={column(klondike.columns.sixth, "sixth")}
        >
          {klondike.columns.sixth.map((e, index) => (
            <img
              src={e.selected ? e.img : defaultIMG}
              alt=""
              id={card(klondike.columns.sixth[index])}
              key={index}
              draggable={e.selected}
              onDragStart={handleDragStart}
              onClick={() => click(e)}
              style={e.selected ? { cursor: "grab" } : {}}
            />
          ))}
        </div>
        <div
          className={s.containers}
          onDragOver={handleDragOver}
          onDrop={handleContainers}
          id={column(klondike.columns.seventh, "seventh")}
        >
          {klondike.columns.seventh.map((e, index) => (
            <img
              src={e.selected ? e.img : defaultIMG}
              alt=""
              id={card(klondike.columns.seventh[index])}
              key={index}
              draggable={e.selected}
              onDragStart={handleDragStart}
              onClick={() => click(e)}
              style={e.selected ? { cursor: "grab" } : {}}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (klondike.loadingStatus) {
    return <PreLoader />;
  }
  return (
    <>
      {show ? (
        <div className={s.btns}>
          <button className={s.btns1} onClick={Game_Start}>
            Easy
          </button>
          <button className={s.btns1} onClick={Game_Start}>
            Hard
          </button>
        </div>
      ) : (
        disp()
      )}
    </>
  );
};
export default Klondike;

import { React } from "react";
import "./Playercards.scss";
import CardItem from "../CardItem";
import { useDispatch, useSelector } from "react-redux";
import { Update } from "../../redux/reducers/durak";

import default_img from "../../img/default.png";
import { update } from "../../assets/rules";
import { toast } from "react-toastify";

const Player_cards = ({ className, socket, id, received, roomCode }) => {
  const dispatch = useDispatch();
  const db = useSelector((state) => state.cards);

  const bitoBtn = () => {
    const state = db;
    const deck = [...state.cards.db];
    return {
      ...state,
      deck: { all: [], player1: [], player2: [] },
      players: {
        player1: {
          ...state.players.player1,
          move: !state.players.player1.move,
          deck:
            state.players.player1.deck.length < 6
              ? [
                  ...deck.splice(0, 6 - state.players.player1.deck.length),
                  ...state.players.player1.deck,
                ]
              : state.players.player1.deck,
        },
        player2: {
          ...state.players.player2,
          move: !state.players.player2.move,
          deck:
            state.players.player2.deck.length < 6
              ? [
                  ...deck.splice(0, 6 - state.players.player2.deck.length),
                  ...state.players.player2.deck,
                ]
              : state.players.player2.deck,
        },
      },
      cards: {
        ...state.cards,
        db: deck,
      },
    };
  };
  const pickAllcards = () => {
    const state = db;
    const deck = [...state.cards.db];
    return {
      ...state,
      players: {
        ...state.players,
        player1: {
          ...state.players.player1,
          deck:
            state.players.player1.move === false
              ? [...state.deck.all, ...state.players.player1.deck]
              : state.players.player1.deck.length < 6 &&
                state.players.player2.move === false
              ? [
                  ...deck.splice(0, 6 - state.players.player1.deck.length),
                  ...state.players.player1.deck,
                ]
              : state.players.player1.deck,
        },
        player2: {
          ...state.players.player2,
          deck:
            state.players.player2.deck.length < 6 &&
            state.players.player1.move === false
              ? [
                  ...deck.splice(0, 6 - state.players.player2.deck.length),
                  ...state.players.player2.deck,
                ]
              : state.players.player2.move === false
              ? [...state.deck.all, ...state.players.player2.deck]
              : state.players.player2.deck,
        },
      },
      deck: { all: [], player1: [], player2: [] },
      cards: {
        ...state.cards,
        db: deck,
      },
    };
  };
  const data = {};
  if (id === 1) {
    data.user = db.players.player1;
    data.yourCards = db.deck.player1;
    data.opponentCards = db.deck.player2;
    data.filtered_Deck = (selectedCard) => {
      const upd = update(selectedCard, db, id);
      socket.emit("update", {
        data: upd,
        id,
        roomCode,
      });
      dispatch(Update(upd));
    };
  } else {
    data.user = db.players.player2;
    data.yourCards = db.deck.player2;
    data.opponentCards = db.deck.player1;
    data.filtered_Deck = (selectedCard) => {
      const upd = update(selectedCard, db, id);
      socket.emit("update", {
        data: upd,
        id,
        roomCode,
      });
      dispatch(Update(upd));
    };
  }
  // Функция которая проверяет играете ли вы по правилам///////////////////
  const GameRule = (yourCard, opponentCard) => {
    if (!data.user.move) {
      if (
        (!yourCard.selected &&
          !opponentCard.selected &&
          yourCard.number > opponentCard.number &&
          yourCard.suit === opponentCard.suit) ||
        (yourCard.selected &&
          opponentCard.selected &&
          yourCard.number > opponentCard.number) ||
        (yourCard.selected && !opponentCard.selected)
      ) {
        return true;
      } else {
        toast.error("Так нельзя");
        return false;
      }
    }
  };
  //----------------------------------------------------------

  // Функция котрая передается картам внутри данного элемента
  const ChooseCard = (selectedCard) => {
    if (
      (!data.user.move &&
        data.opponentCards.length > data.yourCards.length &&
        data.opponentCards.length > 0 &&
        GameRule(selectedCard, data.opponentCards.slice(-1)[0])) ||
      (data.user.move && data.yourCards.length === 0) ||
      (db.deck.all.some((card) => card.name === selectedCard.name) &&
        data.user.move &&
        data.yourCards.length === data.opponentCards.length)
    ) {
      data.filtered_Deck(selectedCard);
    } else if (!data.user.move && data.opponentCards.length === 0) {
      toast.error("Не ваш ход");
    } else if (
      data.user.move &&
      data.yourCards.length > data.opponentCards.length
    ) {
      toast.error("Противник ещё не отбил карту");
    } else if (
      !db.deck.all.some((card) => card.name === selectedCard.name) &&
      data.yourCards.length === data.opponentCards.length &&
      data.user.move
    ) {
      toast.error("Данной карты нет на столе");
    }
  };

  let bito = { display: "none" };

  const ClickBtn = () => {
    if (data.user.move) {
      const data = bitoBtn();
      socket.emit("bito", { data, id, roomCode });
      dispatch(Update(data));
    } else if (!data.user.move) {
      const pickUp = pickAllcards();
      socket.emit("pickAll", { data: pickUp, id, roomCode });
      dispatch(Update(pickUp));
    }
  };

  if (
    (data.user.move &&
      data.yourCards.length === data.opponentCards.length &&
      data.yourCards.length > 0 &&
      received !== id) ||
    (!data.user.move &&
      data.opponentCards.length > data.yourCards.length &&
      data.opponentCards.length > 0 &&
      received !== id)
  ) {
    bito = { display: "block" };
  } else bito = { display: "none" };

  const deck = [...data.user.deck].sort(function (x1, x2) {
    if (x1.suit < x2.suit) return -1;
    if (x1.suit > x2.suit) return 1;
    if (x1.number < x2.number) return -1;
    if (x1.number > x2.number) return 1;
    return 0;
  });
  const displayCard = () =>
    deck.map((element) => {
      return (
        <CardItem
          card={element}
          chooseCard={ChooseCard}
          key={element.suit + element.number}
        />
      );
    });
  const defaultCards = () =>
    deck.map((element) => {
      return (
        <CardItem
          card={{ ...element, img: default_img }}
          chooseCard={() => {}}
          key={element.suit + element.number}
        />
      );
    });
  return (
    <>
      <div className={className}>
        {received !== id ? displayCard() : defaultCards()}
        <button className="bito" style={bito} onClick={ClickBtn}>
          {data.user.move ? "Бито" : "Взять"}
        </button>
      </div>
    </>
  );
};

export default Player_cards;

import { React, useMemo, useState } from "react";
import CardItem from "../CardItem";
import s from "./PlayCards.module.scss";
import "react-toastify/dist/ReactToastify.css";
const DeckCards = ({ id, Deck }) => {
  const [User, setUser] = useState([]);
  useMemo(() => {
    id !== 2 ? setUser(Deck.player1) : setUser(Deck.player2);
  }, [id, Deck]);
  return (
    <div className={s.PlayCards}>
      {User.map((card, index) => (
        <CardItem
          style={s.card}
          card={card}
          key={card.suit + card.number}
          id={index}
          chooseCard={() => {}}
        />
      ))}
    </div>
  );
};

export default DeckCards;

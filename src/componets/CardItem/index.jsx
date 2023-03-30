import React from "react";
import s from "./CardItem.module.scss";
import default_img from "../../img/default.png";

const CardItem = ({ card, chooseCard, opacity }) => {
  return (
    <img
      src={!card ? default_img : card.img}
      alt=""
      className={s.card}
      style={{
        opacity,
      }}
      onClick={() => chooseCard(card)}
    />
  );
};

export default CardItem;

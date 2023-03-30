import { React } from "react";
import "./CardStock.scss";
import CardItem from "../CardItem";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const CardStock = ({ className }) => {
  const Data = useSelector((state) => state.cards.cards);

  let opacity;
  Data.db.length === 0 ? (opacity = 0.2) : (opacity = 1);

  return (
    <div
      className={className}
      onClick={() => {
        if (!!Data.trumpCard.suit) {
          const ale = () => (
            <div style={{ position: "top-left" }}>
              <p>Козыри: {Data.trumpCard.suit}</p>
              <p>Осталось карт: {Data.db.length}</p>
            </div>
          );

          toast(ale());
        } else toast("Для начала начните игру");
      }}
    >
      <CardItem card={Data.trumpCard} opacity={opacity} chooseCard={() => {}} />
      <div className="another_cards_container">
        {Data.db.map((el) => {
          return (
            <div key={el.suit + el.number} className="another_cards"></div>
          );
        })}
      </div>
    </div>
  );
};

export default CardStock;

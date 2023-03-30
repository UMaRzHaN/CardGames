import axios from "axios";
import {
  fetchingCards,
  fetchingCardsError,
  fetchedCards,
} from "../reducers/durak";
import {
  fetchedKlondike,
  fetchingKlondike,
  fetchingKlondikeError,
} from "../reducers/klondike";

export const fetchCards = () => async (dispatch) => {
  try {
    dispatch(fetchingCards());
    dispatch(fetchingKlondike());
    const { data } = await axios.get("http://localhost:4000/Cards");
    dispatch(fetchedCards(data));
    dispatch(fetchedKlondike(data));
  } catch ({ message }) {
    dispatch(fetchingCardsError(message));
    dispatch(fetchingKlondikeError(message));
  }
};

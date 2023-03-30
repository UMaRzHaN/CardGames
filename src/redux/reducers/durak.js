import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: {
    db: [],
    trumpCard: {},
  },
  players: {
    player1: { move: null, deck: [], name: "Player1" },
    player2: { move: null, deck: [], name: "Player2" },
  },
  deck: {
    player1: [],
    player2: [],
    all: [],
  },
  loadingStatus: false,
  errorMessage: "",
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    fetchedCards: (state, action) => {
      state.cards.db = action.payload;
      state.loadingStatus = false;
    },
    fetchingCards: (state) => {
      state.loadingStatus = true;
    },
    fetchingCardsError: (state, action) => {
      state.loadingStatus = false;
      state.errorMessage = action.payload;
    },
    Game_Start: (state, action) => {
      state.cards = action.payload.cards;
      state.players = action.payload.players;
      state.deck = action.payload.deck;
    },
    Update: (state, action) => {
      state.cards = action.payload.cards;
      state.players = action.payload.players;
      state.deck = action.payload.deck;
    },
    setName: (state, action) => {
      state.players.player2.name = action.payload;
    },
  },
});

const { actions, reducer } = cardsSlice;

export const {
  fetchedCards,
  fetchingCards,
  fetchingCardsError,
  Game_Start,
  Update,
  setName,
} = actions;

export default reducer;

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cards: [],
  loadingStatus: false,
  errorMessage: "",
  columns: {
    first: [],
    second: [],
    third: [],
    fourth: [],
    fifth: [],
    sixth: [],
    seventh: [],
  },
  completed: {
    clovers: [],
    hearts: [],
    pikes: [],
    diamonds: [],
  },
  selected: [],
  scores: 0,
  start: false,
  move: 0,
};
const klondikeSlice = createSlice({
  name: "klondike",
  initialState,
  reducers: {
    fetchedKlondike: (state, action) => {
      state.cards = action.payload;
      state.loadingStatus = false;
      state.start = false;
    },
    fetchingKlondike: (state) => {
      state.loadingStatus = true;
      state.start = false;
    },
    fetchingKlondikeError: (state, action) => {
      state.loadingStatus = false;
      state.errorMessage = action.payload;
      state.start = false;
    },
    Start: (state, action) => {
      state.completed.clovers = [];
      state.completed.hearts = [];
      state.completed.diamonds = [];
      state.completed.pikes = [];
      state.selected = [];
      state.scores = 0;

      state.cards = action.payload;
      state.columns.first = state.cards.splice(0, 1);
      state.columns.second = state.cards.splice(0, 2);
      state.columns.third = state.cards.splice(0, 3);
      state.columns.fourth = state.cards.splice(0, 4);
      state.columns.fifth = state.cards.splice(0, 5);
      state.columns.sixth = state.cards.splice(0, 6);
      state.columns.seventh = state.cards.splice(0, 7);
      // -------------------------------------------------
      for (const key in state.columns) {
        state.columns[key] = state.columns[key].map((e) =>
          e === state.columns[key].slice(-1)[0] ? { ...e, selected: true } : e
        );
      }
      state.start = true;
      state.move = 0;
    },
    SelectingCardsformData: (state, action) => {
      if (action.payload === "Easy") {
        if (state.cards.length > 0) {
          state.selected.push(state.cards[0]);
          state.cards.shift();
        }
        if (state.cards.length === 0) {
          state.cards = state.selected;
          state.selected = [];
          state.selected.push(state.cards.slice(-1)[0]);
          state.cards.pop();
        }
      } else {
        if (state.cards.length > 0) {
          state.selected = [...state.selected, ...state.cards.splice(0, 3)];
        }
        if (state.cards.length === 0) {
          state.cards = state.selected;
          state.selected = [];
          state.selected.push(
            state.cards.slice(-3)[0],
            state.cards.slice(-2)[0],
            state.cards.slice(-1)[0]
          );
          state.cards.pop();
          state.cards.pop();
          state.cards.pop();
        }
      }
      state.move++;
    },
    Column: (state, action) => {
      const card = [action.payload.card];
      state.move++;
      if (state.selected.some(({ id }) => id === action.payload.card.id)) {
        state.selected.pop();
      } else {
        for (const key in state.columns) {
          if (
            state.columns[key].some(({ id }) => id === action.payload.card.id)
          ) {
            state.columns[key].forEach((e, index) =>
              index >
              state.columns[key].findIndex(
                ({ id }) => id === action.payload.card.id
              )
                ? card.push(e)
                : ""
            );
            for (let i = 0; i < card.length; i++) {
              state.columns[key].pop();
            }
            state.columns[key] = state.columns[key].map((e) =>
              e.id === state.columns[key].slice(-1)[0].id
                ? { ...e, selected: true }
                : e
            );
          }
        }
        if (
          state.completed[action.payload.card.suit].some(
            ({ id }) => id === action.payload.card.id
          )
        ) {
          state.completed[action.payload.card.suit].pop();
          if (state.scores >= 20) {
            state.scores = 10;
          }
        }
      }
      state.columns[action.payload.colum] = [
        ...state.columns[action.payload.colum],
        ...card,
      ];
      state.scores = state.scores + 5;
    },
    Click: (state, action) => {
      state.move++;
      if (
        action.payload.number ===
        state.completed[action.payload.suit].length + 1
      ) {
        if (state.selected.some(({ id }) => id === action.payload.id)) {
          state.selected = state.selected.filter(
            ({ id }) => id !== action.payload.id
          );
        } else {
          for (const key in state.columns) {
            state.columns[key] = state.columns[key].filter(
              ({ id }) => id !== action.payload.id
            );
            state.columns[key] = state.columns[key].map((e) =>
              e === state.columns[key].slice(-1)[0]
                ? { ...e, selected: true }
                : e
            );
          }
        }
        state.completed[action.payload.suit].push(action.payload);
        state.scores = state.scores + 5;
      }
    },
    Undo: (state, action) => {
      state.move--;
      state.cards = action.payload.cards;
      state.columns = action.payload.columns;
      state.completed = action.payload.completed;
      state.selected = action.payload.selected;
      state.scores = action.payload.scores;
    },
  },
});
const { actions, reducer } = klondikeSlice;

export const {
  fetchedKlondike,
  fetchingKlondike,
  fetchingKlondikeError,
  SelectingCardsformData,
  Start,
  Column,
  Click,
  Undo,
} = actions;

export default reducer;

import { configureStore } from "@reduxjs/toolkit";
import cards from "../reducers/durak";
import klondike from "../reducers/klondike";

export const store = configureStore({ reducer: { cards, klondike } });

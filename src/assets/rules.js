import shuffle from "./shuffle";
export const Start = (state, action, mode, users, whostarted) => {
  let shuff = shuffle([...state.cards.db]);
  switch (mode) {
    case "36":
      shuff = [...shuff].filter(({ number }) => number > 6);
      break;
    case "24":
      shuff = [...shuff].filter(({ number }) => number > 8);
      break;
    default:
      shuff = [...shuff];
      break;
  }
  const shuffwithTrump = shuff.map((element) => {
    if (element.suit === shuff.slice(-1)[0].suit) {
      return { ...element, selected: true };
    } else return element;
  });

  return {
    ...state,
    players: {
      player1: {
        move: action,
        deck: shuffwithTrump.splice(0, 6),
        name: whostarted === users[0].name ? users[1].name : users[0].name,
      },
      player2: {
        move: !action,
        deck: shuffwithTrump.splice(0, 6),
        name: whostarted,
      },
    },
    deck: {
      all: [],
      player1: [],
      player2: [],
    },
    cards: {
      trumpCard: shuffwithTrump.slice(-1)[0],
      db: shuffwithTrump,
    },
  };
};
export const update = (card, db, id) => {
  const state = { ...db };
  if (id === 1) {
    if (state.deck.player1.length < 6) {
      return {
        ...state,
        players: {
          ...state.players,
          player1: {
            ...state.players.player1,
            deck: state.players.player1.deck.filter((e) => e !== card),
          },
        },
        deck: {
          ...state.deck,
          all: [...state.deck.all, card],
          player1: [...state.deck.player1, card],
        },
      };
    }
  } else if (id === 2) {
    if (state.deck.player2.length < 6) {
      return {
        ...state,
        players: {
          ...state.players,
          player2: {
            ...state.players.player2,
            deck: state.players.player2.deck.filter((e) => e !== card),
          },
        },
        deck: {
          ...state.deck,
          all: [...state.deck.all, card],
          player2: [...state.deck.player2, card],
        },
      };
    }
  }
};

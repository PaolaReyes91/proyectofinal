export const CART_ACTIONS = {
  INIT: "CART_INIT",
  ADD: "CART_ADD",
  REMOVE: "CART_REMOVE",
  SET_QTY: "CART_SET_QTY",
  CLEAR: "CART_CLEAR",
};

export const cartInitialState = {
  items: [],
};

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.INIT: {
      const items = action.payload || [];
      return { ...state, items };
    }
    case CART_ACTIONS.ADD: {
      const p = action.payload;
      // Aceptar tanto _id como id
      const productId = p._id || p.id;
      const exists = state.items.find((i) => (i._id || i.id) === productId);
      const items = exists
        ? state.items.map((i) =>
            (i._id || i.id) === productId
              ? { ...i, quantity: i.quantity + (p.quantity || 1) }
              : i,
          )
        : [...state.items, { ...p, _id: productId, quantity: p.quantity || 1 }];
      return { ...state, items };
    }
    case CART_ACTIONS.REMOVE: {
      const id = action.payload;
      return { ...state, items: state.items.filter((i) => (i._id || i.id) !== id) };
    }
    case CART_ACTIONS.SET_QTY: {
      const { _id, quantity } = action.payload;
      const q = Math.max(1, quantity);
      return {
        ...state,
        items: state.items.map((i) =>
          (i._id || i.id) === _id ? { ...i, quantity: q } : i,
        ),
      };
    }
    case CART_ACTIONS.CLEAR: {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}
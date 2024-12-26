const initialState = {
  wishlist: [],
};

const wishlistReducer = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      return {
        ...state,
        wishlist: payload,
      };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: payload,
      };
    case "SET_REDUX_WISHLIST":
      return {
        ...state,
        wishlist: payload,
      };
    default:
      return state;
  }
};

export default wishlistReducer;

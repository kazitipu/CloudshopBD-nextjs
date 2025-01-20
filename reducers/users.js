const INITIAL_STATE = {
  users: [],
  currency: null,
  currentUser: null,
  guest: null,
};

const setUsersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_USERS":
      return { ...state, users: [...action.payload] };
    case "GET_CURRENCY_REDUX":
      return { ...state, currency: action.payload };
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "SET_GUEST":
      return { ...state, guest: action.payload };
    case "UPDATE_ADDRESSBOOK":
      return {
        ...state,
        currentUser: action.payload.guest ? state.currentUser : action.payload,
        guest: action.payload.guest ? action.payload : state.guest,
      };
    default:
      return { ...state };
  }
};
export default setUsersReducer;

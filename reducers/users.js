const INITIAL_STATE = {
  users: [],
  currency: null,
  currentUser: null,
  guest: null,
  announcement: null,
  additionalData: {},
};

const setUsersReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_ALL_USERS":
      return { ...state, users: [...action.payload] };
    case "GET_SINGLE_ANNOUNCEMENT":
      return { ...state, announcement: action.payload };
    case "GET_CURRENCY_REDUX":
      return { ...state, currency: action.payload };
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload, guest: null };
    case "SET_GUEST":
      return { ...state, guest: action.payload, currentUser: null };
    case "SET_ADDITIONAL_DATA":
      return {
        ...state,
        additionalData: action.payload,
      };
    case "UPDATE_ADDRESSBOOK":
      return {
        ...state,
        // jodi guest hoy shekhetre currentUser unchanged thakbe. r jodi user hoy shekhetre guest unchanged thakbe.
        currentUser: action.payload.guest ? state.currentUser : action.payload,
        guest: action.payload.guest ? action.payload : state.guest,
      };
    case "UPDATE_USER":
      return {
        ...state,
        // jodi guest hoy shekhetre currentUser unchanged thakbe. r jodi user hoy shekhetre guest unchanged thakbe.
        currentUser: action.payload.guest ? state.currentUser : action.payload,
        guest: action.payload.guest ? action.payload : state.guest,
      };
    default:
      return { ...state };
  }
};
export default setUsersReducer;

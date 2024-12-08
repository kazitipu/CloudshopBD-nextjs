import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";

// Persistence helpers
// function saveToLocalStorage(state) {
//   if (typeof window === "undefined") return; // Check if in the browser
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem("state", serializedState);
//   } catch (e) {
//     console.error("Could not save state:", e);
//   }
// }

// function loadFromLocalStorage() {
//   if (typeof window === "undefined") return undefined; // Check if in the browser
//   try {
//     const serializedState = localStorage.getItem("state");
//     if (serializedState === null) return undefined;
//     return JSON.parse(serializedState);
//   } catch (e) {
//     console.error("Could not load state:", e);
//     return undefined;
//   }
// }

// Load persisted state
// const persistedState = loadFromLocalStorage();

// Create the store
const store = configureStore({
  reducer: rootReducer,
  devTools: {
    name: "MyAppReduxStore", // Isolate your store
  },
  // preloadedState: persistedState, // Use the persisted state as the initial state
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Include default middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if you're sure about non-serializable values
    }),
});

// Subscribe to store updates and save to localStorage
// if (typeof window !== "undefined") {
//   const unsubscribe = store.subscribe(() => {
//     const state = store.getState();
//     saveToLocalStorage(state);
//   });
// }

export default store;

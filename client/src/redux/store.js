import { configureStore } from "@reduxjs/toolkit";
//importing the user reducer from the userSlice.js file which is in the USER folder inside the redux folder
import userReducer from "./user/userSlice";
import reducer from "./user/userSlice";

export const store = configureStore({
    reducer: {user:userReducer},
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

        console.log(reducer);

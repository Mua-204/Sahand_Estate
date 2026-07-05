import { configureStore,combineReducers } from "@reduxjs/toolkit";
//importing the user reducer from the userSlice.js file which is in the USER folder inside the redux folder
import userReducer from "./user/userSlice";
// import reducer from "./user/userSlice";
import { persistReducer,persistStore } from "redux-persist";//importing the persistReducer from the redux-persist library which is used to persist the user data in the local storage of the browser

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web 

const persistConfig = {
    key: 'root',
    storage:storage.default,
    version: 1,
}
const rootReducer = combineReducers({user:userReducer})
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});


        export const persistor = persistStore(store);
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import schoolReducer from "./slices/schools";
import department from "./slices/department";
import special from "./slices/specials";
import trainningPlaceReducer from "./slices/trainningPlace";

import studentReducer from "./slices/student";

// تكوين redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["schools"], // الحقول التي نريد حفظها
};

const persistedReducer = persistReducer(persistConfig, schoolReducer);

export const store = configureStore({
  reducer: {
    schools: persistedReducer,
    students: studentReducer,
    departments: department,
    specials: special,
    trainningPlaces: trainningPlaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

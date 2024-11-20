import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './root-reducer';
import { rootSaga } from './root-saga';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['user'], // Exclude 'user' from being persisted
};
const sagaMiddleware = createSagaMiddleware();
// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware setup
const middlewares = [
  sagaMiddleware,
  process.env.NODE_ENV === 'development' && logger,
].filter(Boolean);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore redux-persist actions
      },
    }).concat(middlewares),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);
// Persistor setup
export const persistor = persistStore(store);



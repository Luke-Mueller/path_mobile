import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import Thunk from "redux-thunk";

import AppNavigator from "./navigation/AppNavigator";
import AuthReducer from "./store/reducers/auth";
import ListsReducer from './store/reducers/lists';

const rootReducer = combineReducers({
  auth: AuthReducer,
  lists: ListsReducer
});

const store = createStore(rootReducer, applyMiddleware(Thunk));

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

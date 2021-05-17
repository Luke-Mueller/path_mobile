import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import Thunk from "redux-thunk";

import AppNavigator from "./navigation/AppNavigator";
import AuthReducer from "./store/reducers/auth";
import ListReducer from './store/reducers/list';

const rootReducer = combineReducers({
  auth: AuthReducer,
  list: ListReducer
});

const store = createStore(rootReducer, applyMiddleware(Thunk));

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

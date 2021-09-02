import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Thunk from "redux-thunk";

import AppNavigator from "./navigation/AppNavigator";
import AuthReducer from "./store/reducers/auth";
import ListsReducer from "./store/reducers/lists";

const rootReducer = combineReducers({
  auth: AuthReducer,
  lists: ListsReducer,
});

const store = createStore(rootReducer, applyMiddleware(Thunk));
const theme = {
  ...DefaultTheme,
  roundness: 4,
  // dark: true,
  // mode: "adaptive",
  colors: {
    ...DefaultTheme.colors,
    primary: '#00a8ff',
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </Provider>
  );
}

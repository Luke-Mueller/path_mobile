import React from "react";
import { Provider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import AppNavigator from "./navigation/AppNavigator";

import store from './store/store';

const theme = {
  ...DefaultTheme,
  roundness: 4,
  // dark: true,
  // mode: "adaptive",
  colors: {
    ...DefaultTheme.colors,
    primary: "#00a8ff",
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

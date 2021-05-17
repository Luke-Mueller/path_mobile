import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";

import AuthScreen from "../screens/AuthScreen";
import MainNavigator from "./MainNavigator";

const AppNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <NavigationContainer>
      {!user && <AuthScreen />}
      {user && <MainNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

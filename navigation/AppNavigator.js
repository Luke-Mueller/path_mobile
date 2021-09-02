import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";

import AuthNavigator from "../navigation/AuthNavigator";
import MainNavigator from "./MainNavigator";

const AppNavigator = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <NavigationContainer>
      {!user && <AuthNavigator />}
      {user && <MainNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

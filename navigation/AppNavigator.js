import React from "react";
import { useSelector } from "react-redux";

import AuthNavigator from "../navigation/AuthNavigator";
import MainNavigator from "./MainNavigator";

const AppNavigator = () => {
  const user = useSelector((state) => state.auth.user);

  return !user ? <AuthNavigator /> : <MainNavigator />
};

export default AppNavigator;

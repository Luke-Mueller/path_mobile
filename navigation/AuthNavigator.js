import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AuthScreen from "../screens/authScreens/AuthScreen";
import LandingScreen, {
  screenOptions as landingScreenOptions,
} from "../screens/authScreens/LandingScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={landingScreenOptions}
      />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

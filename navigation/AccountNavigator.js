import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/accountScreens/AccountScreen";

const Stack = createStackNavigator();

const AccountNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName="Account" screenOptions={{
      headerTitleStyle: { letterSpacing: 1.25 },
      headerStyle: { backgroundColor: "transparent" },
    }}>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;

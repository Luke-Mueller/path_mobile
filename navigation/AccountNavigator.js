import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen, { screenOptions as AccountScreenOptions } from "../screens/AccountScreen";

const Stack = createStackNavigator();

const AccountNavigator = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={AccountScreenOptions}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;

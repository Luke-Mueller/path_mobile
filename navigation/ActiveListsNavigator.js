import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ActiveListsScreen, {
  screenOptions as ActiveListsScreenOptions,
} from "../screens/listScreens/ActiveListsScreen";

const Stack = createStackNavigator();

const AllListsNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName="Active Lists">
      <Stack.Screen
        name="Active Lists"
        component={ActiveListsScreen}
        options={ActiveListsScreenOptions}
      />
    </Stack.Navigator>
  );
};

export default AllListsNavigator;

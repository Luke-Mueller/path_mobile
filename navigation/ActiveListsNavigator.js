import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ActiveListsScreen, {
  screenOptions as ActiveListsScreenOptions,
} from "../screens/listScreens/ActiveListsScreen";

import ListScreen from "../screens/listScreens/ListScreen";

const Stack = createStackNavigator();

const ActiveListsNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName="Active Lists">
      <Stack.Screen
        name="Active Lists"
        component={ActiveListsScreen}
        options={ActiveListsScreenOptions}
      />
      <Stack.Screen name="Active List" component={ListScreen} act={true} />
    </Stack.Navigator>
  );
};

export default ActiveListsNavigator;

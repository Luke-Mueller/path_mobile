import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import EditListScreen from "../screens/listScreens/EditListScreen";
import ListScreen from "../screens/listScreens/ListScreen";
import ListsNavigator, {
  screenOptions as ListNavScreenOptions,
} from "./ListsNavigator";
import ListsScreen from "../screens/listScreens/ListsScreen";
import NewListScreen from "../screens/listScreens/NewListScreen";

const Stack = createStackNavigator();

const ScreensNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName="Lists Navigation">
      <Stack.Screen name="Active List" component={ListScreen} />
      <Stack.Screen name="Archived List" component={ListScreen} />
      <Stack.Screen name="Edit List" component={EditListScreen} />
      <Stack.Screen name="Invite List" component={ListScreen} />
      <Stack.Screen name="Invite Lists" component={ListsScreen} />
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen
        name="Lists Navigation"
        component={ListsNavigator}
        options={ListNavScreenOptions}
      />
      <Stack.Screen name="New List" component={NewListScreen} />
    </Stack.Navigator>
  );
};

export default ScreensNavigator;

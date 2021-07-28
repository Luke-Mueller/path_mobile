import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import EditListScreen from "../screens/listScreens/EditListScreen";
import ListScreen from "../screens/listScreens/ListScreen";
import ListsScreen, {
  screenOptions as ListsScreenOptions,
} from "../screens/listScreens/ListsScreen";
import NewListScreen from "../screens/listScreens/NewListScreen";

const Stack = createStackNavigator();

const AllListsNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName="All Lists">
      <Stack.Screen name="Edit List" component={EditListScreen} />
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen
        name="All Lists"
        component={ListsScreen}
        options={ListsScreenOptions}
      />
      <Stack.Screen name="New List" component={NewListScreen} />
    </Stack.Navigator>
  );
};

export default AllListsNavigator;

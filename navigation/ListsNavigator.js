import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ActiveListsScreen from "../screens/listScreens/ActiveListsScreen";
import ArchiveListsScreen from "../screens/listScreens/ArchiveListsScreen";
import ListsScreen from "../screens/listScreens/ListsScreen";

const Tab = createBottomTabNavigator();

const ListsNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="All Lists">
      <Tab.Screen name="All Lists" component={ListsScreen} />
      <Tab.Screen name="Started Lists" component={ActiveListsScreen} />
      <Tab.Screen name="Archive" component={ArchiveListsScreen} />
    </Tab.Navigator>
  );
};

export default ListsNavigator;

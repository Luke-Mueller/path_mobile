import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ActiveListsNavigator from './ActiveListsNavigator';
import AllListsNavigator from "./AllListsNavigator";
import ArchiveNavigator from "./ArchiveNavigator";

const Tab = createBottomTabNavigator();

const ListsNavigator = (props) => {
  return (
    <Tab.Navigator initialRouteName="All Lists" >
      <Tab.Screen name="All Lists" component={AllListsNavigator} />
      <Tab.Screen name="Started Lists" component={ActiveListsNavigator} />
      <Tab.Screen name="Archive" component={ArchiveNavigator} />
    </Tab.Navigator>
  );
};

export default ListsNavigator;

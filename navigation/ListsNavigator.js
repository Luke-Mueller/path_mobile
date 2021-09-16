import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ActiveListsScreen from "../screens/listScreens/ActiveListsScreen";
import ArchiveListsScreen from "../screens/listScreens/ArchiveListsScreen";
import ListsScreen from "../screens/listScreens/ListsScreen";

const Tab = createBottomTabNavigator();

const ListsNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="All Lists">
      <Tab.Screen
        name="All Lists"
        component={ListsScreen}
        initialParams={{ listType: "myLists", path: "List" }}
      />
      <Tab.Screen
        name="Started Lists"
        component={ListsScreen}
        initialParams={{ listType: "activeLists", path: "Active List" }}
      />
      <Tab.Screen
        name="Archive"
        component={ListsScreen}
        initialParams={{ listType: "archivedLists", path: "Archived List" }}
      />
    </Tab.Navigator>
  );
};

export default ListsNavigator;

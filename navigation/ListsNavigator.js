import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import ActiveListsScreen from "../screens/listScreens/ActiveListsScreen";
import ArchiveListsScreen from "../screens/archiveScreens/ArchiveListsScreen";
import ListsScreen, {
  screenOptions as ListsScreenOptions,
} from "../screens/listScreens/ListsScreen";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../components/HeaderButton";

const Tab = createBottomTabNavigator();

export const screenOptions = ({ navigation, route }) => {
  return {
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="drawer"
          IconComponent={Feather}
          iconName="menu"
          onPress={() => navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
  };
};

const ListsNavigator = ({ navigation, route }) => {
  return (
    <Tab.Navigator initialRouteName="All Lists">
      <Tab.Screen name="All Lists" component={ListsScreen} />
      <Tab.Screen name="Started Lists" component={ActiveListsScreen} />
      <Tab.Screen name="Archive" component={ArchiveListsScreen} />
    </Tab.Navigator>
  );
};

export default ListsNavigator;

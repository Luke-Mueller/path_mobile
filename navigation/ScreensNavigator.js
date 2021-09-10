import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";

import EditListScreen from "../screens/listScreens/EditListScreen";
import ListScreen from "../screens/listScreens/ListScreen";
import ListsNavigator from "./ListsNavigator";
import ListsScreen from "../screens/listScreens/ListsScreen";
import NewListScreen from "../screens/listScreens/NewListScreen";
import NewListNameScreen from "../screens/listScreens/NewListNameScreen";

import HeaderButton from "../components/HeaderButton";

import store from "../store";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";

const Stack = createStackNavigator();

const headerLeft = (navigation) => (
  <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item
      title="drawer"
      IconComponent={Feather}
      iconName="menu"
      onPress={() => navigation.toggleDrawer()}
    />
  </HeaderButtons>
);

const invitesHeader = (navigation) => (
  <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item
      title="invite list"
      iconName="coffee"
      IconComponent={Feather}
      onPress={() => navigation.navigate("Invite Lists")}
    />
    <Item
      title="new list"
      iconName="plus"
      IconComponent={Feather}
      onPress={() => navigation.navigate("New List")}
    />
  </HeaderButtons>
);

const defaultHeader = (navigation) => (
  <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item
      title="new list"
      iconName="plus"
      IconComponent={Feather}
      onPress={() => navigation.navigate("List Name")}
    />
  </HeaderButtons>
);

const getHeaderRight = ({ navigation, route }) => {
  const state = store.getState();
  const routeName = getFocusedRouteNameFromRoute(route);

  if (
    state.auth.user.inviteLists.length &&
    (routeName === "All Lists" || routeName === undefined)
  ) {
    return invitesHeader(navigation);
  } else if (routeName === "All Lists" || routeName === undefined) {
    return defaultHeader(navigation);
  }
  return null;
};

const ScreensNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName="All Lists" screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="Active List" component={ListScreen} />
      <Stack.Screen name="Archived List" component={ListScreen} />
      <Stack.Screen name="Edit List" component={EditListScreen} />
      <Stack.Screen name="Invite List" component={ListScreen} />
      <Stack.Screen name="Invite Lists" component={ListsScreen} />
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen
        name="All Lists"
        component={ListsNavigator}
        options={({ navigation, route }) => ({
          title: getFocusedRouteNameFromRoute(route),
          headerLeft: () => headerLeft(navigation),
          headerRight: () => getHeaderRight({ navigation, route }),
        })}
      />
      <Stack.Screen name="New List" component={NewListScreen} />
      <Stack.Screen name="List Name" component={NewListNameScreen} options={{ headerTitle: null, headerStyle: {backgroundColor: "transparent"} }} />
    </Stack.Navigator>
  );
};

export default ScreensNavigator;

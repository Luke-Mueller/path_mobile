import React, { useContext } from "react";
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
import { PreferencesContext } from "../utils/context";

import store from "../store";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";
import { CombinedDarkTheme, CombinedDefaultTheme } from "../utils/themes";

const Stack = createStackNavigator();

const HeaderLeft = (isThemeDark, navigation) => (
  <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item
      title="drawer"
      IconComponent={Feather}
      iconName="menu"
      // buttonStyle={
      //   isThemeDark
      //     ? { color: CombinedDarkTheme.colors.placeholder }
      //     : { color: CombinedDefaultTheme.colors.placeholder }
      // }
      onPress={() => navigation.toggleDrawer()}
    />
  </HeaderButtons>
);

const invitesHeader = (isThemeDark, navigation) => (
  <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item
      title="invite list"
      iconName="coffee"
      // buttonStyle={
      //   isThemeDark
      //     ? { color: CombinedDarkTheme.colors.placeholder }
      //     : { color: CombinedDefaultTheme.colors.placeholder }
      // }
      IconComponent={Feather}
      onPress={() => navigation.navigate("Invite Lists")}
    />
    <Item
      title="new list"
      iconName="plus"
      // buttonStyle={
      //   isThemeDark
      //     ? { color: CombinedDarkTheme.colors.placeholder }
      //     : { color: CombinedDefaultTheme.colors.placeholder }
      // }
      IconComponent={Feather}
      onPress={() => navigation.navigate("New List")}
    />
  </HeaderButtons>
);

const defaultHeader = (isThemeDark, navigation) => (
  <HeaderButtons HeaderButtonComponent={HeaderButton}>
    <Item
      title="new list"
      iconName="plus"
      // buttonStyle={
      //   isThemeDark
      //     ? { color: CombinedDarkTheme.colors.placeholder }
      //     : { color: CombinedDefaultTheme.colors.placeholder }
      // }
      IconComponent={Feather}
      onPress={() => navigation.navigate("List Name")}
    />
  </HeaderButtons>
);

const getHeaderRight = (isThemeDark, navigation, route) => {
  const state = store.getState();
  const routeName = getFocusedRouteNameFromRoute(route);

  if (
    state.auth.user.inviteLists.length &&
    (routeName === "All Lists" || routeName === undefined)
  ) {
    return invitesHeader(isThemeDark, navigation);
  } else if (routeName === "All Lists" || routeName === undefined) {
    return defaultHeader(isThemeDark, navigation);
  }
  return null;
};

const ScreensNavigator = (props) => {
  const { isThemeDark } = useContext(PreferencesContext);

  // const headerBackTitleColor = isThemeDark
  //   ? CombinedDarkTheme.colors.placeholder
  //   : CombinedDefaultTheme.colors.placeholder;

  return (
    <Stack.Navigator
      initialRouteName="All Lists"
      screenOptions={{
        // headerLeftContainerStyle: { borderWidth: 3, borderColor: "green" },
        headerStyle: { backgroundColor: "transparent" },
        headerTitleStyle: { letterSpacing: 1.5 },
        headerBackTitle: "Back",
        // headerTintColor: headerBackTitleColor,
      }}
    >
      <Stack.Screen name="Active List" component={ListScreen} />
      <Stack.Screen name="Archived List" component={ListScreen} />
      <Stack.Screen name="Edit List" component={EditListScreen} />
      <Stack.Screen name="Invite List" component={ListScreen} />
      <Stack.Screen
        name="Invite Lists"
        component={ListsScreen}
        initialParams={{ listType: "inviteLists", path: "Invite List" }}
      />
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen
        name="All Lists"
        component={ListsNavigator}
        options={({ navigation, route }) => ({
          title: getFocusedRouteNameFromRoute(route),
          headerLeft: () => HeaderLeft(isThemeDark, navigation),
          headerRight: () => getHeaderRight(isThemeDark, navigation, route ),
        })}
      />
      <Stack.Screen name="New List" component={NewListScreen} />
      <Stack.Screen
        name="List Name"
        component={NewListNameScreen}
        options={{
          headerTitle: null,
          headerStyle: { backgroundColor: "transparent" },
        }}
      />
    </Stack.Navigator>
  );
};

export default ScreensNavigator;

import React, { useContext } from "react";
import { SafeAreaView, View } from "react-native";
import { Divider, Switch, Text } from "react-native-paper";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useDispatch } from "react-redux";
import { PreferencesContext } from "../utils/context";

import AccountNavigator from "./AccountNavigator";
import ScreensNavigator from "./ScreensNavigator";

import * as authActions from "../store/actions/auth";
import * as listsActions from "../store/actions/lists";

const MainDrawerNavigator = createDrawerNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch();
  const { toggleTheme, isThemeDark } = useContext(PreferencesContext);

  return (
    <MainDrawerNavigator.Navigator
      defaultStatus="closed"
      openByDefault={false}
      initialRouteName="Lists"
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, paddingTop: 33 }}>
              <DrawerItemList {...props} />
              <Divider />
              <DrawerItem
                icon={() => <Text>Dark mode</Text>}
                label={() => (
                  <Switch
                    value={isThemeDark}
                    onValueChange={toggleTheme}
                    style={{ alignSelf: "flex-end" }}
                  />
                )}
              />
              <DrawerItem
                label="Logout"
                onPress={() => {
                  dispatch(listsActions.logOut(props.navigation));
                  dispatch(authActions.logOut(props.navigation));
                }}
              />
            </SafeAreaView>
          </View>
        );
      }}
    >
      <MainDrawerNavigator.Screen name="Lists" component={ScreensNavigator} />
      <MainDrawerNavigator.Screen name="Account" component={AccountNavigator} />
    </MainDrawerNavigator.Navigator>
  );
};

export default MainNavigator;

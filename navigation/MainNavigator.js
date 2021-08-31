import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useDispatch } from "react-redux";

import AccountNavigator from "./AccountNavigator";
import ListsNavigator from "./ListsNavigator";

import * as authActions from "../store/actions/auth";
import * as listsActions from "../store/actions/lists";

const MainDrawerNavigator = createDrawerNavigator();

const MainNavigator = () => {
  const dispatch = useDispatch();
  return (
    <MainDrawerNavigator.Navigator
      openByDefault={false}
      initialRouteName="Lists"
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, paddingTop: 33 }}>
              <DrawerItemList {...props} />
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
      <MainDrawerNavigator.Screen name="Lists" component={ListsNavigator} />
      <MainDrawerNavigator.Screen name="Account" component={AccountNavigator} />
    </MainDrawerNavigator.Navigator>
  );
};

export default MainNavigator;

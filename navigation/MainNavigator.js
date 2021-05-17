import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { useDispatch } from "react-redux";

import AccountNavigator from './AccountNavigator';
import ListsNavigator from "./ListsNavigator";

import * as actionTypes from "../store/actions/auth";

const MainDrawerNavigator = createDrawerNavigator();

const MainNavigator = (props) => {
  const dispatch = useDispatch();
  return (
    <MainDrawerNavigator.Navigator
      initialRouteName="Lists"
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <DrawerItemList {...props} />
              <DrawerItem
                label="Dark / Light Mode"
                onPress={() => console.log("D/L Mode")}
              />
              <DrawerItem
                label="Logout"
                onPress={() => dispatch(actionTypes.logOut())}
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

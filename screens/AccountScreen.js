import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Text, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../components/HeaderButton";

import * as authActions from '../store/actions/auth';

export const screenOptions = ({ navigation }) => {
  return {
    headerTitle: "Account",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="drawer"
          iconName="menu"
          onPress={() => navigation.toggleDrawer()}
          />
      </HeaderButtons>
    ),
  };
};

const AccountScreen = (props) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const deleteAccountHandler = () => {
    dispatch(authActions.deleteUser(user.activeLists, user.archivedLists, user.myLists, user._id))
  };

  return (
    <View style={{ flex: 1, justifyContent: "start", alignItems: "center" }}>
      <Button title="Delete Account" onPress={() => deleteAccountHandler()} />
    </View>
  );
};

export default AccountScreen;

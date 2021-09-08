import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";

import * as authActions from "../../store/actions/auth";

export const screenOptions = ({ navigation }) => {
  return {
    headerTitle: "Account",
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

const AccountScreen = (props) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const deleteAccountHandler = () => {
    const activeLists = user.activeLists.length ? user.activeLists : ["none"];
    const archivedLists = user.archivedLists.length
      ? user.archivedLists
      : ["none"];
    const myLists = user.myLists.length ? user.myLists : ["none"];
    dispatch(
      authActions.deleteUser(activeLists, archivedLists, myLists, user._id)
    );
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Button title="Delete Account" onPress={() => deleteAccountHandler()}>
        Delete Account
      </Button>
    </View>
  );
};

export default AccountScreen;

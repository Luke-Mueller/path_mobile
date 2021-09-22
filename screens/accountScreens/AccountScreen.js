import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";

import * as authActions from "../../store/actions/auth";
import { PreferencesContext } from "../../utils/context";

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
  const { toggleTheme, isThemeDark } = useContext(PreferencesContext);
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
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        padding: 40,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text>Dark mode</Text>
        <Switch value={isThemeDark} onValueChange={toggleTheme} />
      </View>
      <Button title="Delete Account" onPress={() => deleteAccountHandler()}>
        Delete Account
      </Button>
    </View>
  );
};

export default AccountScreen;

import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";

import * as authActions from "../../store/actions/auth";
import { CombinedDarkTheme, CombinedDefaultTheme } from "../../utils/themes";
import { PreferencesContext } from "../../utils/context";

const AccountScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const { toggleTheme, isThemeDark } = useContext(PreferencesContext);
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Account",
      headerLeft: () => (
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
      )
    })
  }, [isThemeDark])

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
        <Text style={{ letterSpacing: 1.25, fontWeight: "bold" }}>
          Dark mode
        </Text>
        <Switch value={isThemeDark} onValueChange={toggleTheme} />
      </View>
      <Button
        mode="outlined"
        title="Delete Account"
        labelStyle={{ letterSpacing: 1.25 }}
        onPress={() => deleteAccountHandler()}
      >
        Delete Account
      </Button>
    </View>
  );
};

export default AccountScreen;

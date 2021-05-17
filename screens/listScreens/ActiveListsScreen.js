import React from "react";
import { Text, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";

import HeaderButton from '../../components/HeaderButton';

export const screenOptions = ({ navigation }) => {
  return {
    headerTitle: "Active Lists",
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

const ActiveListsScreen = (props) => {
  return (
    <View>
      <Text>This is the active lists screen</Text>
    </View>
  );
};

export default ActiveListsScreen;

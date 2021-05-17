import React, { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import ListEmptyComponent from "../../components/ListEmptyComponent";

import Color from '../../constants/color';

import * as listActions from "../../store/actions/list";

export const screenOptions = ({ navigation }) => {
  return {
    headerTitle: "Archive",
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

const ArchiveListsScreen = ({ navigation }) => {
  const arcLists = useSelector((state) => state.list.arcLists);
  const { user } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const getArcListsHandler = useCallback(() => {
    dispatch(listActions.getLists(user._id, "arcOwnerIds"));
  }, [dispatch, user, arcLists]);

  useEffect(() => {
    getArcListsHandler();
  }, [getArcListsHandler]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={arcLists}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<ListEmptyComponent arc />}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Archived List", { listId: item._id })
              }
            >
              <View style={styles.button}>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 2.5,
  },
  button: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.highlight,
    paddingVertical: 20,
  },
});

export default ArchiveListsScreen;

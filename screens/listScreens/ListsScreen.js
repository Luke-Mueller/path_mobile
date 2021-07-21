import React, { useCallback, useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import ListsItem from "../../components/ListsItem";

import * as listsActions from "../../store/actions/lists";

export const screenOptions = ({ navigation }) => {
  return {
    headerTitle: "My Lists",
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="new list"
          iconName="plus"
          IconComponent={Feather}
          onPress={() => navigation.navigate("New List")}
        />
      </HeaderButtons>
    ),
  };
};

const ListsScreen = ({ navigation }) => {
  const myLists = useSelector((state) => state.lists.myLists);
  const myListsIds = useSelector((state) => state.auth.user.myLists);

  const dispatch = useDispatch();

  const getListsHandler = useCallback(() => {
    dispatch(listsActions.getLists(myListsIds, "myLists"));
  }, [dispatch, myListsIds]);

  useEffect(() => {
    if (myListsIds.length) {
      getListsHandler();
    }
  }, [getListsHandler, myListsIds]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={myLists}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => (
          <ListsItem list={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default ListsScreen;

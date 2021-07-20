import React, { useCallback, useContext, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import ListEmptyComponent from '../../components/ListEmptyComponent';
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
  // const lists = useSelector((state) => state.lists.myLists);
  const user = useSelector((state) => state.auth.user);
  const myLists = useSelector((state) => state.auth.user.myLists)
  const dispatch = useDispatch();

  const getListsHandler = useCallback(() => {
    dispatch(listsActions.getLists(myLists));
  }, [dispatch, myLists]);

  useEffect(() => {
    if (myLists.length) {
      getListsHandler();
    }
  }, [getListsHandler]);

  return (
    <View style={styles.screen}>
      {/* <FlatList
        data={lists}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => (
          <ListsItem list={item} navigation={navigation} />
        )}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default ListsScreen;

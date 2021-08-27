import React, { useCallback, useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import ListsItem from "../../components/ListsItem";

import * as listsActions from "../../store/actions/lists";

const constants = {
  MY_LISTS: "myLists",
  INVITE_LISTS: "inviteLists",
}

const ListsScreen = ({ navigation, route }) => {
  const [listType, setListType] = useState(
    route.name === "All Lists" ? constants.MY_LISTS : constants.INVITE_LISTS
  );
  const lists = useSelector((state) => state.lists[listType]);
  const listsIds = useSelector((state) => state.auth.user[listType]);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const getListsHandler = useCallback(() => {
    dispatch(listsActions.getLists(listsIds, listType));
  }, [dispatch, lists, listsIds, listType, user]);

  useEffect(() => {
    getListsHandler();
  }, [getListsHandler]);

  useEffect(() => {
    let headerRight = () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="new list"
          iconName="plus"
          IconComponent={Feather}
          onPress={() => navigation.navigate("New List")}
        />
      </HeaderButtons>
    );

    if (listType === constants.INVITE_LISTS) {
      headerRight = () => {
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="reject list"
            iconName="trash"
            IconComponent={Feather}
            onPress={() => console.log("reject list")}
          />
        </HeaderButtons>;
      };
    } else if (user.inviteLists.length) {
      headerRight = () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="invite list"
            iconName="coffee"
            IconComponent={Feather}
            onPress={() => navigation.navigate("Invite Lists")}
          />
          <Item
            title="new list"
            iconName="plus"
            IconComponent={Feather}
            onPress={() => navigation.navigate("New List")}
          />
        </HeaderButtons>
      );
    }

    let headerTitle = "All Lists";
    if (listType === constants.INVITE_LISTS) headerTitle = "List Invites"
    
    const options = {
      headerTitle: headerTitle,
      headerRight: headerRight,
    }

    if (listType === constants.MY_LISTS) {
      options.headerLeft = () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="drawer"
          IconComponent={Feather}
          iconName="menu"
          onPress={() => navigation.toggleDrawer()}
        />
      </HeaderButtons>
      )
    }

    navigation.setOptions(options);
  });

  return (
    <View style={styles.screen}>
      <FlatList
        data={lists}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => (
          <ListsItem
            arr={listType}
            listId={item._id}
            navigation={navigation}
            path={route.name === "All Lists" ? "List" : "Invite List"}
          />
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

import React, { useCallback, useEffect } from "react";
import { FlatList, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import ListsItem from "../../components/ListsItem";

import * as listsActions from "../../store/actions/lists";

export const screenOptions = ({ navigation }) => {
  return {
    headerTitle: "Started Lists",
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

const ActiveListsScreen = ({ navigation }) => {
  const activeLists = useSelector((state) => state.lists.activeLists);
  const activeListsIds = useSelector((state) => state.auth.user.activeLists);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const getListsHandler = useCallback(() => {
    dispatch(listsActions.getLists(activeListsIds, "activeLists"));
  }, [dispatch, activeLists, activeListsIds, user]);

  useEffect(() => {
    getListsHandler();
  }, [getListsHandler, activeListsIds, activeLists]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={activeLists}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => (
          <ListsItem
            arr="activeLists"
            listId={item._id}
            navigation={navigation}
            path="Active List"
          />
        )}
      />
    </View>
  );
};

export default ActiveListsScreen;

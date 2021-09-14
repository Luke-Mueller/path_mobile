import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ListEmptyComponent from "../../components/ListEmptyComponent";
import ListsItem from "../../components/ListsItem";
import Modal from "../../components/Modal";

import * as listsActions from "../../store/actions/lists";

const constants = {
  MY_LISTS: "myLists",
  INVITE_LISTS: "inviteLists",
};

const ListsScreen = ({ navigation, route }) => {
  const [listType, setListType] = useState(
    route.name === "All Lists" ? constants.MY_LISTS : constants.INVITE_LISTS
  );
  const lists = useSelector((state) => state.lists[listType]);
  const listsIds = useSelector((state) => state.auth.user[listType]);
  const user = useSelector((state) => state.auth.user);
  const [loaded, setLoaded] = useState(false);

  const dispatch = useDispatch();

  const getListsHandler = useCallback(() => {
    return dispatch(listsActions.getLists(listsIds, listType));
  }, [dispatch, listsIds, listType]);

  useEffect(() => {
    getListsHandler();
    setLoaded(true)
  }, [getListsHandler, setLoaded]);

  if (!loaded) {
    return (
      <Modal color="#dff9fb">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,.9)",
          }}
        ></View>
      </Modal>
    );
  }

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

import React, { useEffect, useReducer, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import Color from "../../constants/color";
import Modal from "../../components/Modal";

import * as listsActions from "../../store/actions/lists";
import * as authActions from "../../store/actions/auth";

const { width } = Dimensions.get("window");

const listActions = {
  DONE: "DONE",
};

const listReducer = (list, action) => {
  switch (action.type) {
    case listActions.DONE:
      const newList = { ...list };
      const doneItem = newList.items.filter(
        (i) => i._id.toString() === action.id.toString()
      )[0];
      doneItem.done = true;
      newList.progress += 1 / newList.items.length;
      return {
        ...list,
        ...newList,
      };
    default:
      return state;
  }
};

const ListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => {
    return state.lists[
      route.params.listType ? route.params.listType : "myLists"
    ].filter(
      (list) => list._id.toString() === route.params.listId.toString()
    )[0];
  });

  const [list, dispatchList] = useReducer(listReducer, { ...userList });

  const userId = useSelector((state) => state.auth.user._id);

  const [modalText, setModalText] = useState("");
  const [pressed, setPressed] = useState(false);

  let bottomButtons = (
    <View style={styles.bottomContainer}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => activateList()}
      >
        <Feather name="play" size={24} color="black" />
        <Text style={{ marginHorizontal: 25 }}>Start List</Text>
      </TouchableOpacity>
    </View>
  );

  if (route.name === "Active List") {
    bottomButtons = null;
  } else if (route.name === "Archived List") {
    const restoreList = () => {
      // return
      setModalText("Restoring list...");
      setPressed(true);
      const payload = { listId: userList._id, userId };
      dispatch(authActions.restoreList(payload, navigation));
    };
    bottomButtons = (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => restoreList()}
        >
          <MaterialIcons name="unarchive" size={24} color="black" />
          <Text style={{ marginHorizontal: 25 }}>Restore List</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (route.name === "Invite List") {
    bottomButtons = (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>
            dispatch(
              authActions.acceptList(
                { listId: userList._id || route.params.listId, userId },
                navigation
              )
            )
          }
        >
          <MaterialIcons name="add" size={24} color="black" />
          <Text style={{ marginHorizontal: 25 }}>Accept List</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let headerRight = () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="edit list"
        iconName="edit-2"
        IconComponent={Feather}
        onPress={() =>
          navigation.navigate("Edit List", {
            arr: route.params.arr || "myLists",
            listId: route.params.listId,
          })
        }
      />
    </HeaderButtons>
  );

  useEffect(() => {
    if (route.name === "Active List" || route.name === "Archived List") {
      const arr =
        route.name === "Active List" ? "activeLists" : "archivedLists";
      const deleteHandler = () => {
        dispatch(listsActions.deletelist(list._id, userId, arr, navigation));
      };
      const editListHandler = () => {
        dispatch(listsActions.editlist(list, "activeLists", navigation));
      };
      headerRight = () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="delete list"
            iconName="delete-outline"
            IconComponent={MaterialIcons}
            onPress={() => deleteHandler()}
          />
          {route.name === "Active List" && (
            <Item
              title="edit list"
              IconComponent={MaterialIcons}
              iconName="done"
              onPress={() => editListHandler()}
            />
          )}
        </HeaderButtons>
      );
    }
    if (route.name === "Invite List") {
      headerRight = () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="delete list"
            iconName="delete-outline"
            IconComponent={MaterialIcons}
            onPress={() =>
              dispatch(
                authActions.declineList(
                  { listId: list._id, userId },
                  navigation
                )
              )
            }
          />
        </HeaderButtons>
      );
    }
    navigation.setOptions({
      headerTitle: list && list.name ? list.name : "",
      headerRight: headerRight,
    });
  }, [list, navigation, route.name]);

  const activateList = () => {
    setModalText("Creating started list...");
    setPressed(true);
    const payload = { list, userId };
    dispatch(listsActions.activateList(payload, navigation));
  };

  const archiveList = () => {
    setModalText("Archiving list...");
    setPressed(true);
    const payload = { listId: list._id, userId };
    dispatch(listsActions.archivelist(payload, navigation));
  };

  const doneHandler = (id) => {
    dispatchList({ type: listActions.DONE, id });
  };

  if (pressed) {
    return (
      <Modal>
        <View style={styles.contentContainer}>
          <ActivityIndicator color="#34495e" />
          <Text style={{ marginLeft: 20 }}>{modalText}</Text>
        </View>
      </Modal>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          {list?.items?.length > 0 && (
            <FlatList
              data={list.items.filter((i) => !i.done)}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <Text style={styles.text}>
                    {item.item ? item.item : item.subName}
                  </Text>
                  {!!item.subName && (
                    <FlatList
                      data={item.subItems}
                      keyExtractor={(_, idx) => idx.toString()}
                      renderItem={({ item }) => <Text>{item.item}</Text>}
                    />
                  )}
                  {Object.keys(item).includes("done") && (
                    <View>
                      <Button onPress={() => doneHandler(item._id)}>
                        done
                      </Button>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </View>
        {route.name === "Active List" && (
          <View>
            <FlatList
              data={list.items.filter((item) => item.done)}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <Text style={styles.text}>
                    {item.item ? item.item : item.subName}
                  </Text>
                  {!!item.subName && (
                    <FlatList
                      data={item.subItems}
                      keyExtractor={(_, idx) => idx.toString()}
                      renderItem={({ item }) => <Text>{item.item}</Text>}
                    />
                  )}
                </View>
              )}
            />
          </View>
        )}
      </View>
      {bottomButtons}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    backgroundColor: Color.highlight,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "white",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 75,
  },
  container: {
    backgroundColor: Color.highlight,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 2.5,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    alignSelf: "center",
    paddingVertical: 50,
    paddingHorizontal: 80,
  },
  textInput: {
    width: width / 1.5,
    margin: 5,
    backgroundColor: "rgba(0,0,0,0)",
  },
  text: {
    flex: 1,
    backgroundColor: Color.highlight,
    paddingVertical: 20,
  },
});

export default ListScreen;

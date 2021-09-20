import React, { useEffect, useReducer, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import Color from "../../constants/color";
import FlatList from "../../components/FlatList";
import HeaderButton from "../../components/HeaderButton";
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
  // const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState();

  let bottomButtons = (
    <View style={styles.bottomContainer}>
      <Button icon="play" onPress={() => activateList()}>
        start list
      </Button>
    </View>
  );

  if (route.name === "Active List") {
    bottomButtons = null;
  } else if (route.name === "Archived List") {
    const restoreList = () => {
      setModalText("Restoring list...");
      setPressed(true);
      const payload = { listId: userList._id, userId };
      dispatch(authActions.restoreList(payload, navigation));
    };
    bottomButtons = (
      <View style={styles.bottomContainer}>
        <Button icon="restore" onPress={() => restoreList()}>
          restore list
        </Button>
      </View>
    );
  } else if (route.name === "Invite List") {
    bottomButtons = (
      <View style={styles.bottomContainer}>
        <Button icon="add" onPress={() => activateList()}>
          accept list
        </Button>
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
    <View style={{ flex: 1, paddingBottom: 50 }}>
      {item && (
        <Modal>
          <View>
            <Text style={{ marginLeft: 20 }}>{item.item}</Text>
            <Text style={{ marginLeft: 20 }}>{item.details}</Text>
            <Button onPress={() => setItem(null)}>ok</Button>
          </View>
        </Modal>
      )}
      {list?.items?.length > 0 && (
        <FlatList
          data={list.items.filter((i) => !i.done)}
          doneHandler={doneHandler}
          listType={route.params.listType}
          navigation={navigation}
          setItem={setItem}
        />
      )}
      {route.name === "Active List" && (
        <FlatList
          data={list.items.filter((i) => i.done)}
          listType={route.params.listType}
          navigation={navigation}
          blank
        />
      )}
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

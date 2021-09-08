import React, { useEffect, useReducer, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import Color from "../../constants/color";
import Modal from "../../components/Modal";
import * as listsActions from "../../store/actions/lists";
import * as authActions from "../../store/actions/auth";

import { sendList } from "../../utils/api";

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
  const userList = useSelector(
    (state) =>
      state.lists[route.params.arr || "myLists"].filter(
        (list) => list._id.toString() === route.params.listId.toString()
      )[0]
  );
  const [list, dispatchList] = useReducer(listReducer, { ...userList });

  const userId = useSelector((state) => state.auth.user._id);

  const [sendModal, setSendModal] = useState(false);
  const [username, setUsername] = useState();

  let bottomButtons = (
    <View style={styles.bottomContainer}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => archiveList()}
      >
        <Feather name="archive" size={24} color="black" />
        <Text style={{ marginHorizontal: 25 }}>Archive List</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => setSendModal(true)}
      >
        <Feather name="send" size={24} color="black" />
        <Text style={{ marginHorizontal: 25 }}>Send List</Text>
      </TouchableOpacity>
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
      dispatch(authActions.restoreList(list._id, userId, navigation));
      navigation.popToTop();
    };
    bottomButtons = (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => restoreList()}
        >
          <Feather name="archive" size={24} color="black" />
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
              authActions.acceptList({ listId: list._id, userId }, navigation)
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
    const payload = { list, userId };
    dispatch(listsActions.activateList(payload, navigation));
    navigation.popToTop();
  };

  const archiveList = () => {
    const payload = { listId: list._id, userId };
    const { done } = dispatch(listsActions.archivelist(payload, navigation));
    if (done) {
      navigation.navigate("Archive");
    }
  };

  const sendListHandler = async () => {
    const payload = { listId: list._id, username };
    try {
      const { done } = await sendList(payload);
      if (done) {
        Alert.alert(
          "List Sent...",
          `${list.name} was sent to ${username} successfully!`,
          [
            {
              onPress: () => {
                setSendModal(false), setUsername();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doneHandler = (id) => {
    dispatchList({ type: listActions.DONE, id });
  };

  return (
    <View style={{ flex: 1 }}>
      {sendModal && (
        <Modal>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TextInput
              autoCapitalize="none"
              onChangeText={(input) => setUsername(input)}
              placeholder="Enter recipient's username"
              placeholderTextColor="#888"
              style={{ ...styles.input, color: "white" }}
              textAlignVertical="center"
              value={username}
            />
            <Button
              title="Cancel"
              color="white"
              onPress={() => {
                setSendModal(false), setUsername();
              }}
            />
            <Button
              title="Ok"
              color="white"
              onPress={() => sendListHandler()}
            />
          </View>
        </Modal>
      )}
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          {list && !!list.items.length && (
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
                      <Button
                        title="DONE!"
                        onPress={() => doneHandler(item._id)}
                      />
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
  input: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#ddd",
    color: Color.black,
    margin: 5,
    minHeight: 50,
    paddingHorizontal: 20,
    width: 250,
  },
  text: {
    flex: 1,
    backgroundColor: Color.highlight,
    paddingVertical: 20,
  },
});

export default ListScreen;

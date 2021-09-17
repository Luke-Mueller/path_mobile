import React, { useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Menu,
  Text,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import FlatList from "../../components/FlatList";
import Modal from "../../components/Modal";

import * as listsActions from "../../store/actions/lists";
import { sendList } from "../../utils/api";

const { width } = Dimensions.get("window");

const ListsScreen = ({ navigation, route }) => {
  const { listType, path } = route.params;

  const lists = useSelector((state) => state.lists[listType]);
  const listsIds = useSelector((state) => state.auth.user[listType]);

  const [listId, setListId] = useState();

  const [loaded, setLoaded] = useState(false);
  const [menuIsVisible, setMenuIsVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [pressed, setPressed] = useState(false);
  const [sendModal, setSendModal] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const [username, setUsername] = useState();

  const dispatch = useDispatch();

  const getListsHandler = useCallback(() => {
    return dispatch(listsActions.getLists(listsIds, listType));
  }, [dispatch, lists, listType, user]);

  useEffect(() => {
    getListsHandler();
    setLoaded(true);
  }, [getListsHandler, route, setLoaded]);

  useEffect(() => {
    return () => setPressed(false);
  }, [setPressed]);

  const sendListHandler = async () => {
    const payload = { listId, username };
    try {
      const { done } = await sendList(payload);
      if (done) {
        Alert.alert(
          "List Sent...",
          `The list was sent to ${username} successfully!`,
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

  const longPressHandler = useCallback((itemId) => {
    setMenuIsVisible(true), setListId(itemId);
  }, []);

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
      {sendModal && (
        <Modal>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TextInput
              autoCapitalize="none"
              onChangeText={(input) => setUsername(input)}
              label="Recipient's username"
              style={styles.textInput}
              value={username}
            />
            <Button
              onPress={() => {
                setSendModal(false), setUsername();
              }}
            >
              cancel
            </Button>
            <Button onPress={() => sendListHandler()}>ok</Button>
          </View>
        </Modal>
      )}
      {listType === "myLists" ? (
        <Menu
          visible={menuIsVisible}
          onDismiss={() => setMenuIsVisible(false)}
          anchor={
            <FlatList
              data={lists}
              listType={listType}
              longPressHandler={longPressHandler}
              navigation={navigation}
              path={path}
            />
          }
        >
          <Menu.Item
            icon="archive"
            style={{ paddingRight: "60%" }}
            title="Archive list"
            onPress={() => {
              setModalText("Archiving list...");
              const payload = { listId: listId, userId: user._id };
              dispatch(listsActions.archivelist(payload, navigation));
              setMenuIsVisible(false);
            }}
          />
          <Menu.Item
            icon="trash-can-outline"
            title="Delete list"
            onPress={() => {
              dispatch(
                listsActions.deletelist(listId, user._id, "myLists", navigation)
              );
              setMenuIsVisible(false);
            }}
          />
          <Menu.Item
            icon="square-edit-outline"
            title="Edit list"
            onPress={() => {
              navigation.navigate("Edit List", {
                arr: "myLists",
                listId,
              });
              setMenuIsVisible(false);
            }}
          />
          <Menu.Item
            icon="send"
            title="Send list"
            onPress={() => {
              setSendModal(true);
              setMenuIsVisible(false);
            }}
          />
        </Menu>
      ) : (
        <FlatList
          data={lists}
          listType={listType}
          longPressHandler={longPressHandler}
          navigation={navigation}
          path={path}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ListsScreen;

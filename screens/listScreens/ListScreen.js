import React, { useEffect, useReducer } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather, MaterialIcons } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import Color from "../../constants/color";
import * as listsActions from "../../store/actions/lists";
import * as authActions from "../../store/actions/auth";

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
      newList.progress += 1 / list.items.length;
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
      state.lists[route.params.arr].filter(
        (list) => list._id.toString() === route.params.listId.toString()
      )[0]
  );
  const [list, dispatchList] = useReducer(listReducer, { ...userList });

  const userId = useSelector((state) => state.auth.user._id);

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
        onPress={() => activateList()}
      >
        <Feather name="play" size={24} color="black" />
        <Text style={{ marginHorizontal: 25 }}>Start List</Text>
      </TouchableOpacity>
    </View>
  );

  let headerRight = () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="edit list"
        iconName="edit-2"
        IconComponent={Feather}
        onPress={() =>
          navigation.navigate("Edit List", {
            arr: route.params.arr,
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
      headerRight = () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="delete list"
            iconName="delete-outline"
            IconComponent={MaterialIcons}
            onPress={() => deleteHandler()}
          />
        </HeaderButtons>
      );
    }
    navigation.setOptions({
      headerTitle: list && list.name ? list.name : "",
      headerRight: headerRight,
    });
  }, [list, navigation, route.name]);

  const activateList = async () => {
    const payload = { list: list, userId: userId };
    dispatch(listsActions.activateList(payload, navigation));
    navigation.popToTop();
  };

  const archiveList = async () => {
    const payload = { listId: list._id, userId };
    const { done } = await dispatch(
      listsActions.archivelist(payload, navigation)
    );
    if (done) {
      navigation.navigate("Archive");
      navigation.popToTop();
    }
  };

  const doneHandler = (id) => {
    dispatchList({ type: listActions.DONE, id });
  };

  if (route.name === "Active List") {
    bottomButtons = null;
  }

  if (route.name === "Archived List") {
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
  }

  return (
    <View style={{ flex: 1 }}>
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
  text: {
    flex: 1,
    backgroundColor: Color.highlight,
    paddingVertical: 20,
  },
});

export default ListScreen;

import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import Color from "../../constants/color";
import * as listsActions from "../../store/actions/lists";

const ListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const list = useSelector(
    (state) =>
      state.lists[route.params.arr].filter(
        (list) => list._id.toString() === route.params.listId.toString()
      )[0]
  );
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
      headerRight = null;
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
  }

  if (route.name === "Active List" || route.name === "Archived List") {
    bottomButtons = null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View>
        {list && !!list.items.length && (
          <FlatList
            data={list.items}
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
              </View>
            )}
          />
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

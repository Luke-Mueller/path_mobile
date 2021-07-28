import React, { useEffect } from "react";
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
import { HeaderBackButton } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";

import HeaderButton from "../../components/HeaderButton";
import Color from "../../constants/color";
import * as listsActions from "../../store/actions/lists";

const ListScreen = (props) => {
  const { navigation, route } = props;
  const userId = useSelector((state) => state.auth.user._id);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const list = route.params.list;

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
        // onPress={() => navigation.navigate("Edit List", { listId: list._id })}
        onPress={() => console.log("entering edit list")}
      />
    </HeaderButtons>
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: list.name,
      headerRight: headerRight,
    });
  }, [list, navigation]);

  const activateList = async () => {
    const payload = { list: list, userId: userId };
    dispatch(listsActions.activateList(payload, navigation));
  };

  const archiveList = async () => {
    const payload = { listId: list._id, userId };
    dispatch(listsActions.archivelist(payload, navigation));
  };

  // if (route.name === "Active List" || route.name === "Archived List") {
  //   bottomButtons = null
  //   // (
  //   //   <Button title="SEE STATE" onPress={() => console.log("STATE: ", state)} />
  //   // );
  //   headerRight = null;
  // }

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

export default React.memo(ListScreen);

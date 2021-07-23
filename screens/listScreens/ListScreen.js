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
import * as authActions from "../../store/actions/auth";

const ListScreen = (props) => {
  const { navigation, route } = props;
  const userId = useSelector((state) => state.auth.user._id);
  const dispatch = useDispatch();

  const list = route.params.list;

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

  if (props.arc) headerRight = null;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: list.name,
      headerRight: headerRight,
    });
  }, [list, navigation]);

  const activateList = async () => {
    const payload = { list: list, userId: userId };
    dispatch(authActions.activateList(payload, navigation));
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        {!!list.items.length && (
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
                    renderItem={({ item }) => <Text>{item}</Text>}
                  />
                )}
              </View>
            )}
          />
        )}
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => activateList()}
        >
          <Feather name="play" size={24} color="black" />
          <Text style={{ marginHorizontal: 25 }}>Start List</Text>
        </TouchableOpacity>
      </View>
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

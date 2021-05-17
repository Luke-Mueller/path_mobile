import { EDITLIST, GETLISTS, LOGOUT, POSTLIST } from "../actionCreators";

const initialState = {
  arcLists: [],
  lists: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EDITLIST:
      const editIndex = state.lists.findIndex(
        (list) => list._id === action.list._id
      );
      const newListsEdit = state.lists;
      newListsEdit[editIndex] = action.list;
      return {
        ...state,
        lists: newListsEdit,
      };
    case GETLISTS:
      if (action.arr === "ownerIds") {
        return {
          ...state,
          lists: action.lists,
        };
      }
      if (action.arr === "arcOwnerIds") {
        return {
          ...state,
          arcLists: action.lists,
        };
      }
    case LOGOUT:
      return initialState;
    case POSTLIST:
      const newListsSave = state.lists;
      newListsSave.push(action.list);
      return {
        ...state,
        lists: newListsSave,
      };
    default:
      return state;
  }
};

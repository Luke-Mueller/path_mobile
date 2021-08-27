import {
  ADDLIST,
  DELETELIST,
  EDITLIST,
  GETLISTS,
  LOGOUT,
  POSTLIST,
} from "../actionCreators";

const initialState = {
  activeLists: [],
  archivedLists: [],
  inviteLists: [],
  myLists: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADDLIST:
      const arr = state[action.arr];
      arr.push(action.list);
      return {
        ...state,
        [action.arr]: arr,
      };
    case DELETELIST:
      const deleteListArr = state[action.arr].filter(
        (list) => list._id.toString() !== action.listId.toString()
      );
      return {
        ...state,
        [action.arr]: deleteListArr,
      };
    case EDITLIST:
      const editIdx = state.myLists.findIndex(
        (list) => list._id === action.returnedList._id
      );
      const edittedMyLists = state.myLists;
      edittedMyLists[editIdx] = action.returnedList;
      return {
        ...state,
        myLists: edittedMyLists,
      };
    case GETLISTS:
      return {
        ...state,
        [action.arrType]: action.lists,
      };
    case POSTLIST:
      const newMyLists = state.myLists;
      newMyLists.push(action.list);
      return {
        ...state,
        myLists: newMyLists,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

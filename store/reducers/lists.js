import { EDITLIST, GETLISTS, LOGOUT, POSTLIST } from "../actionCreators";

const initialState = {
  activeLists: [],
  archivedLists: [],
  myLists: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
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
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

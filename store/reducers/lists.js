import { EDITLIST, GETLISTS, LOGOUT, POSTLIST } from "../actionCreators";

const initialState = {
  activeLists: [],
  archivedLists: [],
  myLists: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

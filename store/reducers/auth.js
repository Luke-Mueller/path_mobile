import { AUTH, LOGOUT, POSTLIST, UPDATEUSER } from "../actionCreators";

const initialState = {
  user: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH:
      return {
        ...state,
        user: action.user,
      };
    case POSTLIST:
      const newMyLists = state.user.myLists;
      newMyLists.push(action.list._id);
      return {
        ...state,
        user: {
          ...state.user,
          myLists: newMyLists,
        },
      };
    case UPDATEUSER:
      return {
        ...state,
        user: action.user,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

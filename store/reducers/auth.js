import { AUTH, LOGOUT } from "../actionCreators";

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
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

import { createStore, combineReducers, applyMiddleware } from "redux";
import Thunk from "redux-thunk";

import AuthReducer from "./reducers/auth";
import ListsReducer from "./reducers/lists";

const rootReducer = combineReducers({
  auth: AuthReducer,
  lists: ListsReducer,
});

const store = createStore(rootReducer, applyMiddleware(Thunk));

export default store;
import UIReducer from "./Reducers/UI/UIReducer";
import { combineReducers } from "redux";
import LoginStateReducer from "./Reducers/auth/LoginStateReducer";

const AllReducers = combineReducers({
  Login: LoginStateReducer,
  UIData: UIReducer,
});
export default AllReducers;

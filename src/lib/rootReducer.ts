import { combineReducers } from "redux";

import userSliceReducer from "./features/user/userSlice";

const rootReducer = combineReducers({
  user: userSliceReducer,
});

export default rootReducer;

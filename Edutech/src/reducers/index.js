import { combineReducers } from "redux";

import authReducer from '../slices/authSlice';
import profileReducer from '../slices/profileSlice';
import cartReducer from '../slices/cartSlices';
import courseReducer from '../slices/courseSlice';
import adminReducer from '../slices/adminSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  course: courseReducer,
  admin: adminReducer,
});

export default rootReducer;
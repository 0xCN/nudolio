import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import UserReducer from "./UserReducer";
import LayoutReducer from "./LayoutReducer";
import NavigationReducer from "./NavigationReducer";
import DashboardRedcuer from "./DashboardReducer";
import ProductReducer from "./ProductReducer";
import ClientUsersReducer from "./ClientUsersReducer";
import keyReducer from "./KeyReducer";
import assignedKeyReducer from "./AssignedKeyReducer";

const RootReducer = combineReducers({
  login: LoginReducer,
  user: UserReducer,
  dashboard: DashboardRedcuer,
  layout: LayoutReducer,
  navigations: NavigationReducer,
  products: ProductReducer,
  users: ClientUsersReducer,
  keys: keyReducer,
  assigned_keys: assignedKeyReducer
});

export default RootReducer;

import {
  SET_USER_DATA,
  REMOVE_USER_DATA,
  USER_LOGGED_OUT,
  PENDING_USER_PASSWORD,
  SUCCESS_USER_PASSWORD,
  ERROR_USER_PASSWORD
} from "../actions/UserActions";

const initialState = {
  pending: false,
  error: null
};

const userReducer = function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_DATA: {
      return {
        ...state,
        ...action.data
      };
    }
    case REMOVE_USER_DATA: {
      return {
        ...state
      };
    }
    case USER_LOGGED_OUT: {
      return state;
    }
    case PENDING_USER_PASSWORD: {
      return {
        ...state,
        pending: true
      }
    }
    case SUCCESS_USER_PASSWORD: {
      return {
        ...state,
        pending: false,
        error: null
      }
    }
    case ERROR_USER_PASSWORD: {
      return {
        ...state,
        pending: false,
        error: action.error
      }
    }
    default: {
      return state;
    }
  }
};

export default userReducer;

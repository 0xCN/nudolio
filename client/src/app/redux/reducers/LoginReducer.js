import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_LOADING,
  REGISTER_ERROR,
  REGISTER_LOADING,
  REGISTER_SUCCESS
} from "../actions/LoginActions";

const initialState = {
  success: false,
  loading: false,
  error: null
};

const LoginReducer = function(state = initialState, action) {
  switch (action.type) {

    case LOGIN_LOADING: {
      return {
        ...state,
        error: null,
        loading: true
      };
    }

    case LOGIN_SUCCESS: {
      return {
        ...state,
        success: true,
        error: null,
        loading: false
      };
    }

    case LOGIN_ERROR: {
      return {
        ...state,
        success: false,
        loading: false,
        error: action.error.error
      };
    }

    case REGISTER_LOADING: {
      return {
        ...state,
        error: null,
        loading: true
      }
    }

    case REGISTER_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.data.error
      }
    }

    case REGISTER_SUCCESS: {
      return {
        ...state,
        error: null,
        loading: false,
        success: true
      }
    }

    default: {
      return state;
    }
  }
};


export default LoginReducer;
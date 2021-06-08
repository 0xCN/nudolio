import jwtAuthService from "../../services/jwtAuthService";
import { setUserData } from "./UserActions";
import history from "history.js";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";

export const REGISTER_ERROR = "REGISTER_ERROR";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_LOADING = "REGISTER_LOADING";

export function loginWithUnameAndPassword({ username, password }) {
  return dispatch => {
    dispatch({
      type: LOGIN_LOADING
    });

    jwtAuthService
      .loginWithUnameAndPassword(username, password)
      .then(user => {
        if (user.token) {
          dispatch(setUserData(user));
          history.push({
            pathname: "/"
          });
          return dispatch({
            type: LOGIN_SUCCESS
          });
        } else if (user.error) {
          throw (user.error);
        }

      })
      .catch(error => {
        return dispatch({
          type: LOGIN_ERROR,
          error: error
        });
      });
  };
}


export function register(username, password) {
  return dispatch => {
    dispatch({ type: REGISTER_LOADING });
    fetch("/rest/auth/register", {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        uname: username,
        password: password
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res);
        }
        dispatch({ type: REGISTER_SUCCESS });
      })
      .catch(res => {
        dispatch({
          type: REGISTER_ERROR,
          data: res,
        });
      })

  }
}

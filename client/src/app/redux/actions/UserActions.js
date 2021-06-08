import history from "history.js";
import jwtAuthService from "../../services/jwtAuthService";

export const SET_USER_DATA = "USER_SET_DATA";
export const REMOVE_USER_DATA = "USER_REMOVE_DATA";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";

export const PENDING_USER_PASSWORD = "PENDING_CHANGE_PASSWORD";
export const SUCCESS_USER_PASSWORD = "SUCCESS_CHANGE_PASSWORD";
export const ERROR_USER_PASSWORD = "ERROR_CHANGE_PASSWORD";


export function setUserData(user) {
  return dispatch => {
    dispatch({
      type: SET_USER_DATA,
      data: user
    });
  };
}

export const changeUserPassword = (token, currentPass, newPass) => {
  return (dispatch) => {
    dispatch({type: PENDING_USER_PASSWORD});
    let URL = '/rest/admin/change_password';
    fetch(URL, {
      method: "PATCH",
      headers: { 'auth-token': token, 'Content-type': 'application/json' },
      body: JSON.stringify({
        currentPassword: currentPass,
        newPassword: newPass
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        throw (res.error);
      } else if (res._original) {
        throw ("password should follow requirements")
      }
      dispatch({type: SUCCESS_USER_PASSWORD});
    })
    .catch(error => {
      dispatch({type: ERROR_USER_PASSWORD, error: error});
    })
  }
}


export function logoutUser() {
  return dispatch => {
    jwtAuthService.logout();

    history.push({
      pathname: "/session/signin"
    });

    dispatch({
      type: USER_LOGGED_OUT
    });
  };
}

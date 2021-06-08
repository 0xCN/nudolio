export const DELETE_KEY_SUCCESS = 'DELETE_AKEY_SUCCESS';
export const DELETE_KEY_PENDING = 'DELETE_AKEY_PENDING';
export const DELETE_KEY_ERROR = 'DELETE_AKEY_ERROR';

export const FETCH_KEYS_PENDING = 'FETCH_AKEYS_PENDING';
export const FETCH_KEYS_SUCCESS = 'FETCH_AKEYS_SUCCESS';
export const FETCH_KEYS_ERROR = 'FETCH_AKEYS_ERROR';


// fetching unassigned keys
export function fetchKeys(token, page, limit, search = null, selector = null) {
  return (dispatch) => {
    dispatch({ type: FETCH_KEYS_PENDING });
    let URL = `/rest/keys/assigned/paginate?page=${page}&limit=${limit}`;
    if (search != null && selector != null) {
      URL += `&selector=${selector}&search=${search}`
    }
    fetch(URL, {
      method: "GET",
      headers: { 'auth-token': token }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch({
          type: FETCH_KEYS_SUCCESS,
          payload: res
        });
      })
      .catch(error => {
        dispatch({
          type: FETCH_KEYS_ERROR,
          error: error
        });
      })
  }
}

export function deleteMultiKeys(token, keys = []) {
  return (dispatch) => {
    dispatch({ type: DELETE_KEY_PENDING });
    let URL = '/rest/keys/assigned/';
    fetch(URL, {
      method: "DELETE",
      headers: { 'Content-type': 'application/json', 'auth-token': token },
      body: JSON.stringify({
        keys: keys
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch({
          type: DELETE_KEY_SUCCESS,
          payload: res
        });
      })
      .catch(error => {
        dispatch({
          type: DELETE_KEY_ERROR,
          error: error
        });
      })
  }
}
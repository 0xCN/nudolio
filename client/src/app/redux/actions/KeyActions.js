export const DELETE_KEY_SUCCESS = 'DELETE_KEY_SUCCESS';
export const DELETE_KEY_PENDING = 'DELETE_KEY_PENDING';
export const DELETE_KEY_ERROR = 'DELETE_KEY_ERROR';

export const FETCH_KEYS_PENDING = 'FETCH_KEYS_PENDING';
export const FETCH_KEYS_SUCCESS = 'FETCH_KEYS_SUCCESS';
export const FETCH_KEYS_ERROR = 'FETCH_KEYS_ERROR';

export const GENERATE_KEYS_PENDING = 'GENERATE_KEYS_PENDING';
export const GENERATE_KEYS_SUCCESS = 'GENERATE_KEYS_SUCCESS';
export const GENERATE_KEYS_ERROR = 'GENERATE_KEYS_ERROR';

export const ASSIGN_KEYS_PENDING = 'ASSIGN_KEYS_PENDING';
export const ASSIGN_KEYS_SUCCESS = 'ASSIGN_KEYS_SUCCESS';
export const ASSIGN_KEYS_ERROR = 'ASSIGN_KEYS_ERROR';


// fetching unassigned keys
export function fetchKeys(token, page, limit, search = null, selector = null) {
  return (dispatch) => {
    dispatch({ type: FETCH_KEYS_PENDING });
    let URL = `/rest/keys/paginate?page=${page}&limit=${limit}`;
    if (search != null && selector != null) {
      if (selector === "product_id") {
        URL += `&product_id=${search}`
      } else {
        URL += `&selector=${selector}&search=${search}`
      }
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

// deleting assigned keys
export function deleteKey(token, email, keyID) {
  return (dispatch) => {
    dispatch({ type: DELETE_KEY_PENDING });
    let URL = `/rest/keys/assigned/`;
    fetch(URL, {
      method: "DELETE",
      headers: { 'Content-type': 'application/json', 'auth-token': token },
      body: JSON.stringify({
        email: email,
        _id: keyID
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
          payload: error
        });
      })
  }
}


// deleting unassigned keys
export function deleteMultiKeys(token, keys = []) {
  return (dispatch) => {
    dispatch({ type: DELETE_KEY_PENDING });
    let URL = '/rest/keys/';
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

// generate keys
export function generateKeys(token, data) {
  return (dispatch) => {
    dispatch({ type: GENERATE_KEYS_PENDING });
    let URL = '/rest/keys/multi';
    fetch(URL, {
      method: "POST",
      headers: { 'Content-type': 'application/json', 'auth-token': token },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch({
          type: GENERATE_KEYS_SUCCESS,
          payload: res
        });
      })
      .catch(error => {
        dispatch({
          type: GENERATE_KEYS_ERROR,
          error: error
        });
      })
  }
}

// assign keys
export function assignKeys(token, email, keys) {
  return (dispatch) => {
    dispatch({ type: ASSIGN_KEYS_PENDING });
    let URL = '/rest/keys/assign';
    fetch(URL, {
      method: "PATCH",
      headers: { 'Content-type': 'application/json', 'auth-token': token },
      body: JSON.stringify({
        email: email,
        keys: keys
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        dispatch({
          type: ASSIGN_KEYS_SUCCESS,
          payload: res
        });
      })
      .catch(error => {
        dispatch({
          type: ASSIGN_KEYS_ERROR,
          error: error
        });
      })
  }
}
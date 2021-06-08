export const FETCH_USERS_PENDING = 'FETCH_USERS_PENDING';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR';

export const CREATE_USER_PENDING = 'CREATE_USER_PENDING';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';

export const DELETE_USER_PENDING = 'DELETE_USER_PENDING';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_ERROR = 'DELETE_USER_ERROR';



function fetchUsersPending() {
    return {
        type: FETCH_USERS_PENDING
    }
}

function fetchUsersSuccess(data) {
    return {
        type: FETCH_USERS_SUCCESS,
        payload: data
    }
}

function fetchUsersError(error) {
    return {
        type: FETCH_USERS_ERROR,
        error: error
    }
}

export function fetchUsers(token, page, limit, search=null, selector=null) {
    return (dispatch) => {
        dispatch(fetchUsersPending());
        let URL = `/rest/users/paginate?page=${page}&limit=${limit}`;
        if (search != null && selector != null) {
            URL += `&selector=${selector}&search=${search}`
        }
        fetch(URL, {
            method: "GET",
            headers: {'auth-token': token}
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch(fetchUsersSuccess(res));
        })
        .catch(error => {
            dispatch(fetchUsersError(error));
        })
    }
}

export function createUser(data) {
    return (dispatch) => {
        dispatch({ type: CREATE_USER_PENDING });
        fetch('/public-api/v1/user/register', {
            method: "POST",
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch({
                type: CREATE_USER_SUCCESS,
                payload: res
            });
        })
        .catch(error => {
            dispatch({
                type: CREATE_USER_ERROR,
                error: error
            });
        })
    }
}

export function deleteUser(token, id) {
    return (dispatch) => {
        dispatch({ type: DELETE_USER_PENDING });
        let URL = `/rest/users/${id}`;
        fetch(URL, {
            method: "DELETE",
            headers: { 'auth-token': token }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch({
                    type: DELETE_USER_SUCCESS,
                    payload: res
                });
            })
            .catch(error => {
                dispatch({
                    type: DELETE_USER_ERROR,
                    payload: error
                });
            })
    }
}

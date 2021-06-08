export const FETCH_PRODUCT_PENDING = 'FETCH_PRODUCT_PENDING';
export const FETCH_PRODUCT_SUCCESS = 'FETCH_PRODUCT_SUCCESS';
export const FETCH_PRODUCT_ERROR = 'FETCH_PRODUCT_ERROR';

export const DELETE_PRODUCT_PENDING = 'DELETE_PRODUCT_PENDING';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_ERROR = 'DELETE_PRODUCT_ERROR';

export const CREATE_PRODUCT_PENDING = 'CREATE_PRODUCT_PENDING';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_ERROR = 'CREATE_PRODUCT_ERROR';

export const UPDATE_PRODUCT_PENDING = 'UPDATE_PRODUCT_PENDING';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_ERROR = 'UPDATE_PRODUCT_ERROR';



export function fetchProduct(data) {
    return (dispatch) => {
        dispatch({
            type: FETCH_PRODUCT_PENDING
        });
        fetch('/rest/products/', {
            method: "GET",
            headers: {'auth-token': data.token}
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch({
                type: FETCH_PRODUCT_SUCCESS,
                payload: res
            });
        })
        .catch(error => {
            dispatch({
                type: FETCH_PRODUCT_ERROR,
                error: error
            });
        })
    }
}

export function deleteProduct(token, id) {
    return (dispatch) => {
        dispatch({ type: DELETE_PRODUCT_PENDING });
        fetch('/rest/products/', {
            method: "DELETE",
            headers: {'auth-token': token, 'Content-type': 'application/json'},
            body: JSON.stringify({_id: id})
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch({
                type: DELETE_PRODUCT_SUCCESS,
                payload: res
            });
        })
        .then(dispatch(fetchProduct({token: token})))
        .catch(error => {
            dispatch({
                type: DELETE_PRODUCT_ERROR,
                error: error
            });
        })
    }
}


export function createProduct(token, name, description) {
    return (dispatch) => {
        dispatch({ type: CREATE_PRODUCT_PENDING });
        fetch('/rest/products/', {
            method: "POST",
            headers: {'auth-token': token, 'Content-type': 'application/json'},
            body: JSON.stringify({name: name, description: description})
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch({
                type: CREATE_PRODUCT_SUCCESS,
                payload: res
            });
        })
        .then(dispatch(fetchProduct({token: token})))
        .catch(error => {
            dispatch({
                type: CREATE_PRODUCT_ERROR,
                error: error
            });
        })
    }
}

export function updateProduct(token, id, name, description) {
    return (dispatch) => {
        dispatch({ type: UPDATE_PRODUCT_PENDING });
        fetch('/rest/products/', {
            method: "PATCH",
            headers: {'auth-token': token, 'Content-type': 'application/json'},
            body: JSON.stringify({_id: id, name: name, description: description})
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch({
                type: UPDATE_PRODUCT_SUCCESS,
                payload: res
            });
        })
        .then(dispatch(fetchProduct({token: token})))
        .catch(error => {
            dispatch({
                type: UPDATE_PRODUCT_ERROR,
                error: error
            });
        })
    }
}

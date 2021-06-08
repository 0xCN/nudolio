export const FETCH_DASHBOARD_PENDING = 'FETCH_DASHBOARD_PENDING';
export const FETCH_DASHBOARD_SUCCESS = 'FETCH_DASHBOARD_SUCCESS';
export const FETCH_DASHBOARD_ERROR = 'FETCH_DASHBOARD_ERROR';

function fetchDashboardPending() {
    return {
        type: FETCH_DASHBOARD_PENDING
    }
}

function fetchDashboardSuccess(data) {
    return {
        type: FETCH_DASHBOARD_SUCCESS,
        payload: data
    }
}

function fetchDashboardError(error) {
    return {
        type: FETCH_DASHBOARD_ERROR,
        error: error
    }
}

function fetchDashboard(data) {
    return (dispatch) => {
        dispatch(fetchDashboardPending());
        fetch('/rest/admin/me', {
            method: "GET",
            headers: {'auth-token': data.token}
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch(fetchDashboardSuccess(res));
        })
        .catch(error => {
            dispatch(fetchDashboardError(error));
        })
    }
}

export default fetchDashboard;
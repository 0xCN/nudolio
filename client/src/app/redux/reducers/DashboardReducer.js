import {FETCH_DASHBOARD_PENDING, FETCH_DASHBOARD_SUCCESS, FETCH_DASHBOARD_ERROR} from '../actions/DashboardActions';

const initialState = {
    pending: true,
    dashboard: {},
    error: null
}

export default function dashboardReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_DASHBOARD_PENDING: 
            return {
                ...state,
                pending: true
            }
        case FETCH_DASHBOARD_SUCCESS:
            return {
                ...state,
                pending: false,
                dashboard: action.payload
            }
        case FETCH_DASHBOARD_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default: 
            return state;
    }
}

export const getDashboard = state => state.dashboard;
export const getDashboardPending = state => state.pending;
export const getDashboardError = state => state.error;
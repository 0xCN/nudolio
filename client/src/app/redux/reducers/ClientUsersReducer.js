import {
    FETCH_USERS_PENDING, FETCH_USERS_SUCCESS, FETCH_USERS_ERROR,
    CREATE_USER_PENDING, CREATE_USER_SUCCESS, CREATE_USER_ERROR,
    DELETE_USER_ERROR, DELETE_USER_SUCCESS, DELETE_USER_PENDING
} from '../actions/ClientUserActions';

const initialState = {
    pending: true,
    docs: [],
    totalDocs: 0,
    offset: 0,
    limit: 0,
    totalPages: 0,
    page: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
    error: null
}

export default function userReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_USERS_PENDING: 
            return {
                ...state,
                pending: true
            }
        case DELETE_USER_PENDING:
            return {
                ...state,
                pending: true
            }
        case CREATE_USER_PENDING: 
            return {
                ...state,
                pending: true
            }
        case FETCH_USERS_SUCCESS:
            return {
                ...state,
                pending: false,
                docs: action.payload.docs,
                limit: action.payload.limit,
                hasPrevPage: action.payload.hasPrevPage,
                hasNextPage: action.payload.hasNextPage,
                totalPages: action.payload.totalPages,
                totalDocs: action.payload.totalDocs,
                page: action.payload.page,
                pagingCounter: action.payload.pagingCounter,
                error: null
            }
        case CREATE_USER_SUCCESS: 
            return {
                ...state,
                pending: false,
                error: null
            }
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                pending: false,
                error: null
            }
        case FETCH_USERS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case CREATE_USER_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case DELETE_USER_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getUsers = state => state.docs;
export const getUsersPending = state => state.pending;
export const getUsersError = state => state.error;
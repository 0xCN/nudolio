import {
  DELETE_KEY_PENDING, DELETE_KEY_SUCCESS, DELETE_KEY_ERROR,
  FETCH_KEYS_PENDING, FETCH_KEYS_SUCCESS, FETCH_KEYS_ERROR,
  GENERATE_KEYS_PENDING,
  ASSIGN_KEYS_PENDING, ASSIGN_KEYS_SUCCESS, ASSIGN_KEYS_ERROR
} from '../actions/KeyActions';


const initialState = {
  pending: true,
  assignPending: true,
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
  error: null,
  message: null
}


export default function keyReducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_KEY_PENDING:
      return {
        ...state,
        pending: true
      }
    case GENERATE_KEYS_PENDING:
      return {
        ...state,
        pending: true
      }
    case FETCH_KEYS_PENDING:
      return {
        ...state,
        pending: true
      }
    case ASSIGN_KEYS_PENDING:
      return {
        ...state,
        assignPending: true
      }
    case FETCH_KEYS_SUCCESS:
      return {
        ...state,
        docs: action.payload.docs,
        limit: action.payload.limit,
        hasPrevPage: action.payload.hasPrevPage,
        hasNextPage: action.payload.hasNextPage,
        totalPages: action.payload.totalPages,
        totalDocs: action.payload.totalDocs,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        error: null,
        pending: false
      }
    case DELETE_KEY_SUCCESS:
      return {
        ...state,
        pending: false,
        error: null
      }
    case ASSIGN_KEYS_SUCCESS:
      return {
        ...state,
        assignPending: false,
        error: null,
        message: action.message
      }
    case FETCH_KEYS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    case DELETE_KEY_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error
      }
    case ASSIGN_KEYS_ERROR:
      return {
        ...state,
        assignPending: false,
        error: action.error
      }
    default:
      return state;
  }
}

export const getKeys = state => state.docs;
export const getKeyPending = state => state.pending;
export const getKeyError = state => state.error;
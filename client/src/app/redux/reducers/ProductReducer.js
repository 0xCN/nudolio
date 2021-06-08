import {
    FETCH_PRODUCT_PENDING, FETCH_PRODUCT_SUCCESS, FETCH_PRODUCT_ERROR,
    DELETE_PRODUCT_PENDING, DELETE_PRODUCT_ERROR,
    CREATE_PRODUCT_PENDING, CREATE_PRODUCT_ERROR,
    UPDATE_PRODUCT_PENDING, UPDATE_PRODUCT_ERROR
} from '../actions/ProductActions';

const initialState = {
    pending: true,
    products: [],
    error: null
}

export default function productReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_PRODUCT_PENDING || DELETE_PRODUCT_PENDING || CREATE_PRODUCT_PENDING || UPDATE_PRODUCT_PENDING: 
            return {
                ...state,
                pending: true
            }
        case FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                pending: false,
                products: action.payload
            }
        case FETCH_PRODUCT_ERROR || DELETE_PRODUCT_ERROR || CREATE_PRODUCT_ERROR || UPDATE_PRODUCT_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default: 
            return state;
    }
}

export const getProduct = state => state.products;
export const getProductPending = state => state.pending;
export const getProductError = state => state.error;
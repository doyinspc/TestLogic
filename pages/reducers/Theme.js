import {
    THEME_GET_MULTIPLE,
    THEME_GET_ONE, 
    THEME_LOADING,
    THEME_LOADING_ERROR 
} from "../types/Theme";

const initialState = {
    isLoading: false,
    themes: [],
    theme: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case THEME_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case THEME_GET_MULTIPLE:
            return {
                ...state,
                themes : action.payload,
                isLoading: false
            };
        case THEME_GET_ONE:
            return {
                ...state,
                message : action.payload,
                isLoading: false
            };
        case THEME_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
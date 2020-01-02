import {
    USER_GET_MULTIPLE,
    USER_GET_ONE, 
    USER_LOADING,
    USER_LOADING_ERROR 
} from "../types/User";

const initialState = {
    isLoading: false,
    users: [],
    user: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                user: {},
                isLoading: true
            };
        case USER_GET_MULTIPLE:
            return {
                ...state,
                users : action.payload,
                isLoading: false
            };
        case USER_GET_ONE:
            return {
                ...state,
                user: action.payload,
                isLoading: false
            };
        case USER_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
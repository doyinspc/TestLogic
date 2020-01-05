import {
    SUBJECT_GET_MULTIPLE,
    SUBJECT_GET_ONE, 
    SUBJECT_LOADING,
    SUBJECT_LOADING_ERROR,
    SUBJECT_LOADING_ERROR_ONLINE, 
    SUBJECT_GET_MULTIPLE_ONLINE,
    SUBJECT_LOADING_ONLINE
} from "../types/Subject";

const initialState = {
    isLoading: false,
    isLoadingOnline: false,
    subjects: [],
    subject: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case SUBJECT_LOADING:
            return {
                ...state,
                isLoading: true
            };
         case SUBJECT_LOADING_ONLINE:
            return {
                ...state,
                isLoadingOnline: true
            };
        case SUBJECT_GET_MULTIPLE_ONLINE:
            return {
                ...state,
                subjects : action.payload,
                isLoadingOnline: false
            };
        case SUBJECT_GET_MULTIPLE:
            return {
                ...state,
                subjects : action.payload,
                isLoading: false
            };
        case SUBJECT_GET_ONE:
            return {
                ...state,
                message : action.payload,
                isLoading: false
            };
        case SUBJECT_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case SUBJECT_LOADING_ERROR_ONLINE:
            return {
                ...state,
                isLoadingOnline: false
            };
        default:
            return state;
    }
}
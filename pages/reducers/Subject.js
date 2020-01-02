import {
    SUBJECT_GET_MULTIPLE,
    SUBJECT_GET_ONE, 
    SUBJECT_LOADING,
    SUBJECT_LOADING_ERROR 
} from "../types/Subject";

const initialState = {
    isLoading: false,
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

        default:
            return state;
    }
}
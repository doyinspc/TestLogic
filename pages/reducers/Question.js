import {
    QUESTION_GET_MULTIPLE,
    QUESTION_GET_ONE, 
    QUESTION_LOADING,
    QUESTION_LOADING_ERROR 
} from "../types/Question";

const initialState = {
    isLoading: false,
    questions: [],
    question: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case QUESTION_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case QUESTION_GET_MULTIPLE:
            return {
                ...state,
                questions : action.payload,
                isLoading: false
            };
        case QUESTION_GET_ONE:
            return {
                ...state,
                message : action.payload,
                isLoading: false
            };
        case QUESTION_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
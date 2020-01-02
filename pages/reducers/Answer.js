import {
    ANSWER_GET_MULTIPLE,
    ANSWER_GET_ONE, 
    ANSWER_LOADING,
    ANSWER_LOADING_ERROR 
} from "../types/Answer";

const initialState = {
    isLoading: false,
    answers: [],
    answer: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case ANSWER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case ANSWER_GET_MULTIPLE:
            return {
                ...state,
                answers : action.payload,
                isLoading: false
            };
        case ANSWER_GET_ONE:
            return {
                ...state,
                message : action.payload,
                isLoading: false
            };
        case ANSWER_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
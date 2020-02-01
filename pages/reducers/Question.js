import {
    QUESTION_GET_MULTIPLE,
    QUESTION_LOADING,
    QUESTION_LOADING_ERROR 
} from "../types/Question";

const initialState = {
    isLoading: false,
    questions: [],
    msg:'None'
}

export default function(state = initialState, action){
    switch (action.type) {
        case QUESTION_LOADING:
            return {
                ...state,
                isLoading: true,
                questions: []
            };
        case QUESTION_GET_MULTIPLE:
            return {
                ...state,
                questions : action.payload
            };
        case QUESTION_LOADING_ERROR:
            return {
                ...state,
                isLoading: false,
                msg:action.msg
            };
        default:
            return state;
    }
}
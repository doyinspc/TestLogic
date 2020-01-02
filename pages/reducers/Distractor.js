import {
    DISTRACTOR_GET_MULTIPLE,
    DISTRACTOR_GET_ONE, 
    DISTRACTOR_LOADING,
    DISTRACTOR_LOADING_ERROR 
} from "../types/Distractor";

const initialState = {
    isLoading: false,
    distractors: [],
    distractor: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case DISTRACTOR_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case DISTRACTOR_GET_MULTIPLE:
            return {
                ...state,
                distractors : action.payload,
                isLoading: false
            };
        case DISTRACTOR_GET_ONE:
            return {
                ...state,
                message : action.payload,
                isLoading: false
            };
        case DISTRACTOR_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
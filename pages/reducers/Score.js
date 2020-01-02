import {
    SCORE_GET_MULTIPLE,
    SCORE_GET_ONE, 
    SCORE_LOADING,
    SCORE_LOADING_ERROR 
} from "../types/Score";

const initialState = {
    isLoading: false,
    scores: [],
    score: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case SCORE_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case SCORE_GET_MULTIPLE:
            return {
                ...state,
                scores : action.payload,
                isLoading: false
            };
        case SCORE_GET_ONE:
            console.log(action.payload)
            return {
                ...state,
                score: action.payload[0],
                isLoading: false
            };
        case SCORE_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
import {
    TOPIC_GET_MULTIPLE,
    TOPIC_GET_ONE, 
    TOPIC_LOADING,
    TOPIC_LOADING_ERROR,
    TOPIC_GET_QUESTIONS,
    TOPIC_GET_ID
} from "../types/Topic";

const initialState = {
    isLoading: false,
    topics: [],
    topic: {},
    testRawQuestions:{},
    activeTestID : null,
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case TOPIC_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case TOPIC_GET_MULTIPLE:
            return {
                ...state,
                topics : action.payload,
                isLoading: false
            };
        case TOPIC_GET_QUESTIONS:
            return {
                ...state,
                testRawQuestions : action.payload,
                isLoading: false
            };
        case TOPIC_GET_ONE:
            return {
                ...state,
                message : action.payload,
                isLoading: false
            };
        case TOPIC_GET_ID:
            return {
                ...state,
                activeTestID : action.payload,
                isLoading: false
            };
        case TOPIC_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
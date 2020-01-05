import {
    TOPIC_GET_MULTIPLE,
    TOPIC_LOADING,
    TOPIC_LOADING_ERROR,
    TOPIC_INSERT_LOADING,
    TOPIC_INSERT_ERROR,
    TOPIC_INSERTED,
    TOPIC_QUESTION_LOADING,
    TOPIC_QUESTION_GET,
    TOPIC_QUESTION_ERROR
} from "../types/Topic";

const initialState = {
    isLoading: false,
    isLoadingTest: false,
    isInsertingTest: false,
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
                isLoading: true,
                topics: []
            };
        case TOPIC_QUESTION_LOADING:
            return {
                ...state,
                isLoadingTest: true,
                testRawQuestions:{}
            };
       case TOPIC_INSERT_LOADING:
            return {
                ...state,
                isInsertingTest: true,
                activeTestID: null
            };
        case TOPIC_GET_MULTIPLE:
            return {
                ...state,
                topics : action.payload,
                isLoading: false
            };
        case TOPIC_QUESTION_GET:
            return {
                ...state,
                testRawQuestions : action.payload,
                isLoadingTest: false
            };
        case TOPIC_INSERTED:
            return {
                ...state,
                activeTestID : action.payload,
                isInsertingTest: false
            }; 
        case TOPIC_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case TOPIC_QUESTION_ERROR:
            return {
                ...state,
                isLoadingTest: false
            };
        case TOPIC_INSERT_ERROR:
            return {
                ...state,
                isInsertingTest: false
            };
    

        default:
            return state;
    }
}
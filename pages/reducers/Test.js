import {
    TEST_GET_MULTIPLE,
    TEST_GET_ONE, 
    TEST_LOADING,
    TEST_LOADING_ERROR 
} from "../types/Test";

const initialState = {
    isLoading: false,
    tests: [],
    test: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case TEST_LOADING:
            return {
                ...state,
                test: {},
                isLoading: true
            };
        case TEST_GET_MULTIPLE:
            return {
                ...state,
                tests : action.payload,
                isLoading: false
            };
        case TEST_GET_ONE:
            return {
                ...state,
                test: action.payload,
                isLoading: false
            };
        case TEST_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
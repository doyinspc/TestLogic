import {
    INSTRUCTION_GET_MULTIPLE,
    INSTRUCTION_GET_ONE, 
    INSTRUCTION_LOADING,
    INSTRUCTION_LOADING_ERROR 
} from "../types/Instruction";

const initialState = {
    isLoading: false,
    instructions: [],
    instruction: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case INSTRUCTION_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case INSTRUCTION_GET_MULTIPLE:
            return {
                ...state,
                instructions : action.payload,
                isLoading: false
            };
        case INSTRUCTION_GET_ONE:
            return {
                ...state,
                message : action.payload,
                isLoading: false
            };
        case INSTRUCTION_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}
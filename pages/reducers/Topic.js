import {
    TOPIC_GET_ONE, 
    TOPIC_LOADING_ONLINE, 
    TOPIC_LOADING_ONLINE_ERROR, 
    TOPIC_LOADING,
    TOPIC_LOADING_ERROR,
    TOPIC_GET_MULTIPLE,
    TOPIC_GET_MULTIPLE_ONLINE,
    TOPIC_GET_SELECTED
} from "../types/Topic";

const initialState = {
    isLoading: false,
    isLoadingOnline: false,
    topics: [],
    topic: {},
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
         case TOPIC_LOADING_ONLINE:
            return {
                ...state,
                isLoadingOnline: true
            };
        case TOPIC_GET_MULTIPLE:
            return {
                ...state,
                topics : action.payload,
                isLoading: false
            };
        case TOPIC_GET_MULTIPLE_ONLINE:
            let newArray = [];
            let oldArray = [...state.topics];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray.filter((r)=>r.id == row.id);
                f && Array.isArray(f) && f.length == 1 ? newArray.push(f[0]) : newArray.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArray = [...newArray, ...onlineArray];
            return {
                ...state,
                topics : newArray,
                isLoadingOnline: false
            };
        case TOPIC_GET_ONE:
            let id = action.payload;
            let newArray = [...state.topics];
            let newRow = newArray && Array.isArray(newArray) ? newArray.filter(row => row.id == id )[0] : {};
            return {
                ...state,
                topic : newRow,
                isLoading: false
            };
        case TOPIC_GET_SELECTED:
           return {
                ...state,
                isEdit : action.payload
            };
        case TOPIC_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case TOPIC_LOADING_ONLINE_ERROR:
            return {
                ...state,
                isLoadingOnline: false
            };
        default:
            return state;
    }
}
import {
    SUBJECT_GET_ONE, 
    SUBJECT_LOADING_ONLINE, 
    SUBJECT_LOADING_ONLINE_ERROR, 
    SUBJECT_LOADING,
    SUBJECT_LOADING_ERROR,
    SUBJECT_GET_MULTIPLE,
    SUBJECT_GET_MULTIPLE_ONLINE,
} from "../types/Subject";

const initialState = {
    isLoading: false,
    isLoadingOnline: false,
    subjects: [],
    subject: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case SUBJECT_LOADING:
            return {
                ...state,
                isLoading: true
            };
         case SUBJECT_LOADING_ONLINE:
            return {
                ...state,
                isLoadingOnline: true
            };
        case SUBJECT_GET_MULTIPLE:
            return {
                ...state,
                subjects : action.payload,
                isLoading: false
            };
        case SUBJECT_GET_MULTIPLE_ONLINE:
            let newArray = [];
            let oldArray = [...state.subjects];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray.filter((r)=>r.id == row.id);
                f && Array.isArray(f) && f.length == 1 ? newArray.push(f[0]) : newArray.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArray = [...newArray, ...onlineArray];
            return {
                ...state,
                subjects : newArray,
                isLoadingOnline: false
            };
        case SUBJECT_GET_ONE:
            let id = action.payload;
            let newArray = [...state.subjects];
            let newRow = newArray && Array.isArray(newArray) ? newArray.filter(row => row.id == id )[0] : {};
            return {
                ...state,
                subject : newRow,
                isLoading: false
            };
        case SUBJECT_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case SUBJECT_LOADING_ONLINE_ERROR:
            return {
                ...state,
                isLoadingOnline: false
            };
        default:
            return state;
    }
}
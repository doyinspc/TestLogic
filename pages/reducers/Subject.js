import {
    SUBJECT_GET_ONE, 
    SUBJECT_LOADING,
    SUBJECT_LOADING_ERROR,
    SUBJECT_GET_MULTIPLE,
    SUBJECT_DOWNLOADING, 
    SUBJECT_DOWNLOADING_SUCCESS, 
    SUBJECT_DOWNLOADING_FAIL,
} from "../types/Subject";

const initialState = {
    isLoading: false,
    isDownloading: false,
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
         case SUBJECT_DOWNLOADING:
            return {
                ...state,
                isDownloading: true
            };
        case SUBJECT_GET_MULTIPLE:
            return {
                ...state,
                subjects : action.payload,
                isLoading: false
            };
        case SUBJECT_DOWNLOADING_SUCCESS:
            let newArrayx = [];
            let oldArray = [...state.subjects];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray.filter((r)=>r.id == row.id);
                f && Array.isArray(f) && f.length == 1 ? newArrayx.push(f[0]) : newArrayx.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArrayx = [...newArrayx, ...onlineArray];
            return {
                ...state,
                subjects : newArrayx,
                isDownloading: false
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
        case SUBJECT_DOWNLOADING_FAIL:
            return {
                ...state,
                isDownloading: false
            };
        default:
            return state;
    }
}
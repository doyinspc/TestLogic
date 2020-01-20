import {
    THEME_GET_MULTIPLE,
    THEME_GET_SELECTED,
    THEME_GET_ONE, 
    THEME_LOADING,
    THEME_LOADING_ERROR,
    THEME_DOWNLOADING,
    THEME_DOWNLOADING_SUCCESS,
    THEME_DOWNLOADING_FAIL
} from "../types/Theme";

const initialState = {
    isLoading: false,
    isDownloading: false,
    themes: [],
    theme: {},
    msg: null,
    isEdit: 0,
    ids: [],
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case THEME_LOADING:
            return {
                ...state,
                isLoading: true,
                themes:[],
                theme:{},
                ids:[]
            };
         case THEME_DOWNLOADING:
            return {
                ...state,
                isDownloading: true
            };
        case THEME_GET_MULTIPLE:
            return {
                ...state,
                themes : action.payload,
                isLoading: false
            };
        case THEME_DOWNLOADING_SUCCESS:
            let newArrayx = [];
            let oldArray = [...state.themes];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray && Array.isArray(onlineArray) && onlineArray.length > 0  ? onlineArray.filter((r)=>r.id == row.id) : null;
                f && Array.isArray(f) && f.length == 1 ? newArrayx.push(f[0]) : newArrayx.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArrayx = onlineArray && Array.isArray(onlineArray) && onlineArray.length > 0  ? [...newArrayx, ...onlineArray]: onlineArray;
            return {
                ...state,
                themes : newArrayx,
                isDownloading: false
            };
        case THEME_GET_ONE:
            let id = action.payload;
            let newArray = [...state.themes];
            let newRow = newArray && Array.isArray(newArray) ? newArray.filter(row => row.id == id )[0] : {};
            return {
                ...state,
                theme : newRow,
                isEdit : id,
                isLoading: false
            };
        case THEME_GET_SELECTED:
            return {
                ...state,
                ids : action.payload
            };
        case THEME_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case THEME_DOWNLOADING_FAIL:
            return {
                ...state,
                isDownloading: false
            };
        default:
            return state;
    }
}
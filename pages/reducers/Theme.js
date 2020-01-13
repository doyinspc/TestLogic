import {
    THEME_GET_ONE, 
    THEME_LOADING_ONLINE, 
    THEME_LOADING_ONLINE_ERROR, 
    THEME_LOADING,
    THEME_LOADING_ERROR,
    THEME_GET_MULTIPLE,
    THEME_GET_MULTIPLE_ONLINE,
    THEME_GET_SELECTED
} from "../types/Theme";

const initialState = {
    isLoading: false,
    isLoadingOnline: false,
    themes: [],
    theme: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case THEME_LOADING:
            return {
                ...state,
                isLoading: true
            };
         case THEME_LOADING_ONLINE:
            return {
                ...state,
                isLoadingOnline: true
            };
        case THEME_GET_MULTIPLE:
            return {
                ...state,
                themes : action.payload,
                isLoading: false
            };
        case THEME_GET_MULTIPLE_ONLINE:
            let newArray = [];
            let oldArray = [...state.themes];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray.filter((r)=>r.id == row.id);
                f && Array.isArray(f) && f.length == 1 ? newArray.push(f[0]) : newArray.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArray = [...newArray, ...onlineArray];
            return {
                ...state,
                themes : newArray,
                isLoadingOnline: false
            };
        case THEME_GET_ONE:
            let id = action.payload;
            let newArray = [...state.themes];
            let newRow = newArray && Array.isArray(newArray) ? newArray.filter(row => row.id == id )[0] : {};
            return {
                ...state,
                theme : newRow,
                isLoading: false
            };
        case THEME_GET_SELECTED:
            return {
                ...state,
                isEdit : action.payload
            };
        case THEME_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case THEME_LOADING_ONLINE_ERROR:
            return {
                ...state,
                isLoadingOnline: false
            };
        default:
            return state;
    }
}
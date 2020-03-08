import {
    MOCK_GET_MULTIPLE,
    MOCK_GET_SELECTED,
    MOCK_GET_ONE, 
    MOCK_LOADING,
    MOCK_LOADING_ERROR,
    MOCK_DOWNLOADING,
    MOCK_DOWNLOADING_SUCCESS,
    MOCK_DOWNLOADING_FAIL
} from "../types/Mock";

const initialState = {
    isLoading: false,
    isDownloading: false,
    mocks: [],
    mock: {},
    msg: null,
    isEdit: 0,
    ids: [],
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case MOCK_LOADING:
            return {
                ...state,
                isLoading: true,
                mocks:[],
                mock:{},
                ids:[]
            };
         case MOCK_DOWNLOADING:
            return {
                ...state,
                isDownloading: true
            };
        case MOCK_GET_MULTIPLE:
            return {
                ...state,
                mocks : action.payload,
                isLoading: false
            };
        case MOCK_DOWNLOADING_SUCCESS:
            let newArrayx = [];
            let oldArray = [...state.mocks];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray && Array.isArray(onlineArray) && onlineArray.length > 0  ? onlineArray.filter((r)=>r.id == row.id) : null;
                f && Array.isArray(f) && f.length == 1 ? newArrayx.push(f[0]) : newArrayx.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArrayx = onlineArray && Array.isArray(onlineArray) && onlineArray.length > 0  ? [...newArrayx, ...onlineArray]: onlineArray;
            return {
                ...state,
                mocks : newArrayx,
                isDownloading: false
            };
        case MOCK_GET_ONE:
            let id = action.payload;
            let newArray = [...state.mocks];
            let newRow = newArray && Array.isArray(newArray) ? newArray.filter(row => row.id == id )[0] : {};
            return {
                ...state,
                mock : newRow,
                isEdit : id,
                isLoading: false
            };
        case MOCK_GET_SELECTED:
            return {
                ...state,
                ids : action.payload
            };
        case MOCK_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case MOCK_DOWNLOADING_FAIL:
            return {
                ...state,
                isDownloading: false
            };
        default:
            return state;
    }
}
import {
    TOPIC_GET_MULTIPLE,
    TOPIC_GET_SELECTED,
    TOPIC_GET_ONE, 
    TOPIC_LOADING,
    TOPIC_LOADING_ERROR,
    TOPIC_DOWNLOADING,
    TOPIC_DOWNLOADING_SUCCESS,
    TOPIC_DOWNLOADING_FAIL
} from "../types/Topic";

const initialState = {
    isLoading: false,
    isDownloading: false,
    topics: [],
    topic: {},
    msg: null,
    isEdit: 0,
    ids: [],
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case TOPIC_LOADING:
            return {
                ...state,
                isLoading: true,
                topics:[],
                topic:{},
                ids:[]
            };
         case TOPIC_DOWNLOADING:
            return {
                ...state,
                isDownloading: true,
                msg:action.payload
            };
        case TOPIC_GET_MULTIPLE:
            let newTopics = [];
            if(action.status == 3)
            {
                let OldTop = [...state.topics];
                let oldTopicsID = [];
                OldTop.map((row) =>(oldTopicsID.push(row.id)));
                let newTop = action.payload;
                newTop && Array.isArray(newTop) && newTop.length > 0 ? newTop.filter((row) => !oldTopicsID.includes(row.id)) : [];
                newTopics = [...OldTop, ...newTop];
            }else{
                newTopics  = action.payload
            }
           
            return {
                ...state,
                topics :newTopics,
                isLoading: false
            };
        
        case TOPIC_DOWNLOADING_SUCCESS:
            let newArrayx = [];
            let oldArray = [...state.topics];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray.filter((r)=>r.id == row.id);
                f && Array.isArray(f) && f.length == 1 ? newArrayx.push(f[0]) : newArrayx.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArrayx = [...newArrayx, ...onlineArray];
            return {
                ...state,
                topics : newArrayx,
                isDownloading: false
            };
        case TOPIC_GET_ONE:
            let id = action.payload;
            let newArray = [...state.topics];
            let newRow = newArray && Array.isArray(newArray) ? newArray.filter(row => row.id == id )[0] : {};
            return {
                ...state,
                topic : newRow,
                isEdit : id
            };
        case TOPIC_GET_SELECTED:
            return {
                ...state,
                ids : action.payload
            };
        case TOPIC_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case TOPIC_DOWNLOADING_FAIL:
            return {
                ...state,
                isDownloading: false
            };
        default:
            return state;
    }
}
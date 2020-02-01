import {
    RESOURCE_GET_MULTIPLE,
    RESOURCE_GET_SELECTED,
    RESOURCE_GET_ONE, 
    RESOURCE_LOADING,
    RESOURCE_LOADING_ERROR,
    RESOURCE_DOWNLOADING,
    RESOURCE_DOWNLOADING_SUCCESS,
    RESOURCE_DOWNLOADING_FAIL
} from "../types/Resource";

let r = [
    {
        id:1,
        topicID: 1,
        title: 'Method of growing vegetables',
        author: 'L. Ron Hubbard',
        type: 1,
        data1: '',
        data2: '',
        source: 'www.jickaduna.com.ng',
        description: ''
    },
    {
        id:2,
        topicID: 2,
        title: 'Method of growing vegetables',
        author: 'L. Ron Hubbard',
        type: 1,
        data1: '',
        data2: '',
        source: 'www.jickaduna.com.ng',
        description: ''
    },
    {
        id:3,
        topicID: 3,
        title: 'Method of growing vegetables',
        author: 'L. Ron Hubbard',
        type: 1,
        data1: '',
        data2: '',
        source: 'www.jickaduna.com.ng',
        description: ''
    },
    {
        id:4,
        topicID: 4,
        title: 'Method of growing vegetables',
        author: 'L. Ron Hubbard',
        type: 1,
        data1: '',
        data2: '',
        source: 'www.jickaduna.com.ng',
        description: ''
    },
    {
        id:5,
        topicID: 5,
        title: 'How to make a farm',
        author: 'L. Ron Hubbard',
        type: 1,
        data1: '',
        data2: '',
        source: 'www.jickaduna.com.ng',
        description: ''
    },
]
const initialState = {
    isLoading: false,
    isDownloading: false,
    resources: r,
    resource: {},
    msg: null,
    isEdit: 0,
    ids: [],
    isForm: false,
    showActions: false
}

export default function(state = initialState, action){
    switch (action.type) {
        case RESOURCE_LOADING:
            return {
                ...state,
                isLoading: true,
                resources:[],
                resource:{},
                ids:[]
            };
         case RESOURCE_DOWNLOADING:
            return {
                ...state,
                isDownloading: true
            };
        case RESOURCE_GET_MULTIPLE:
            return {
                ...state,
                resources : action.payload,
                isLoading: false
            };
        case RESOURCE_DOWNLOADING_SUCCESS:
            let newArrayx = [];
            let oldArray = [...state.resources];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray.filter((r)=>r.id == row.id);
                f && Array.isArray(f) && f.length == 1 ? newArrayx.push(f[0]) : newArrayx.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArrayx = [...newArrayx, ...onlineArray];
            return {
                ...state,
                resources : newArrayx,
                isDownloading: false
            };
        case RESOURCE_GET_ONE:
            let id = action.payload;
            let newArray = [...state.resources];
            let newRow = newArray && Array.isArray(newArray) ? newArray.filter(row => row.id == id )[0] : {};
            return {
                ...state,
                resource : newRow,
                isEdit : id,
                isLoading: false
            };
        case RESOURCE_GET_SELECTED:
            return {
                ...state,
                ids : action.payload
            };
        case RESOURCE_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case RESOURCE_DOWNLOADING_FAIL:
            return {
                ...state,
                isDownloading: false
            };
        default:
            return state;
    }
}
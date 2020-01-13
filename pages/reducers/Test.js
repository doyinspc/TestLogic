import {
    TEST_GET_ONE,

    TEST_UPLOADING, 
    TEST_UPLOADING_FAIL, 
    TEST_UPLOADING_SUCCESS,
  
    TEST_DOWNLOADING, 
    TEST_DOWNLOADING_FAIL, 
    TEST_DOWNLOADING_SUCCESS,
  
    TEST_LOADING,
    TEST_LOADING_ERROR,
    TEST_GET_MULTIPLE,
  
    TEST_INSERT_SUCCESS,
    TEST_INSERT_LOADING,
    TEST_INSERT_FAIL,
  
    TEST_UPDATE_SUCCESS,
    TEST_UPDATE_LOADING,
    TEST_UPDATE_FAIL,
  
    TEST_DELETE_SUCCESS,
    TEST_DELETE_FAIL
} from "../types/Topic";

const initialState = {
    isLoading: false,
    isInserting: false,
    isUpdating: false,
    isDownloading: false,
    isUploading: false,
    tests: [],
    test: {},
    testQuestions:{},
    activeTestID : null
}

export default function(state = initialState, action){
    switch (action.type) {
        case TEST_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case TEST_UPLOADING:
            return {
                ...state,
                isUploading: true
            };
        case TEST_DOWNLOADING:
            return {
                ...state,
                isDownloading: true
            };
        case TEST_UPDATE_LOADING:
            return {
                ...state,
                isUpdating: true
            };
        case TEST_INSERT_LOADING:
            return {
                ...state,
                isInserting: true
            };
        case TEST_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };
        case TEST_UPLOADING_SUCCESS:
        case TEST_UPLOADING_FAIL:
            return {
                ...state,
                isUploading: false
            };
        case TEST_DOWNLOADING_FAIL:
            return {
                ...state,
                isDownloading: false
            };
        case TEST_UPDATE_FAIL:
            return {
                ...state,
                isUpdating: false
            };
        case TEST_INSERT_FAIL:
            return {
                ...state,
                isInserting: false
            };
        case TEST_GET_MULTIPLE:
            return {
                ...state,
                isLoading: false,
                tests: action.payload
        };
       case TEST_GET_ONE:
            let id = action.payload;
            let newArray = [...state.tests];
            let newRow = newArray && Array.isArray(newArray) ? newArray.filter(row => row.id == id )[0] : {};
            return {
                ...state,
                test : newRow,
                isLoading: false
            };
        case TEST_DOWNLOADING_SUCCESS:
            let newArray = [];
            let oldArray = [...state.tests];
            let onlineArray = action.payload;
            oldArray.forEach((row)=>{
                let f = onlineArray.filter((r)=>r.id == row.id);
                f && Array.isArray(f) && f.length == 1 ? newArray.push(f[0]) : newArray.push(row);
                onlineArray = onlineArray.filter((r)=>r.id != row.id);
            })
            newArray = [...newArray, ...onlineArray];
            return {
                ...state,
                tests : newArray,
                isLoadingOnline: false
            };
        case TEST_UPDATE_SUCCESS:
            let oldArray = [...state.tests];
            let updatedRow = action.payload;
            let filterRows = oldArray.filter((row)=>row.id != id);
            let filterRow = oldArray.filter((row)=>row.id == id)[0];
            Object.keys(filterRow).forEach(r=>{
                    if(updatedRow[r])
                    {
                        filterRow[r] = updatedRow[r];
                    }
                });
            let newArray = [...filterRows, ...filterRow];
            return {
                ...state,
                tests : newArray,
                isLoadingOnline: false
            };
        case TEST_INSERT_SUCCESS:
            let newArray = [];
            let oldArray = [...state.tests];
            let newRow = action.payload;
            newArray = [...oldArray, ...newRow];
            return {
                ...state,
                tests : newArray,
                isLoadingOnline: false
            };
        default:
            return state;
    }
}
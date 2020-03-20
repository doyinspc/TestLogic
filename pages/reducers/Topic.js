import {
    TOPIC_GET_MULTIPLE,
    TOPIC_EDIT_SUCCESS,
    TOPIC_GET_SELECTED,
    TOPIC_GET_ONE, 
    TOPIC_LOADING,
    TOPIC_LOADING_ERROR,
    TOPIC_DOWNLOADING,
    TOPIC_DOWNLOADING_SUCCESS,
    TOPIC_DOWNLOADING_FAIL,
    TOPIC_DOWNLOADING_START,
    TOPIC_DOWNLOADING_STATE,
    TOPIC_UPDATING_STATE
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
    showActions: false,
    tquestions:{},
    tloading:{},
    tupdate:{},
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
        case TOPIC_DOWNLOADING_START:
            let tq = {...state.tquestions};
            let nu = action.topicid;
            tq[nu] = action.topicquestions;
            return {
                ...state,
                tquestions:tq
            };
        case TOPIC_DOWNLOADING_STATE:
            let tqs = {...state.tloading};
            let tqs1 = {...state.tquestions};
            let nus = action.topicid;
            let nnum = Math.floor((action.tquestions/tqs1[nus]) * 100);
            tqs[nus] = nnum;
            //console.log(`this is all ${nus} ${action.tquestions} ${tqs1[nus]} ${tqs[nus]}`)
            return {
                ...state,
                tloading:tqs
            };
        case TOPIC_UPDATING_STATE:
            let tups = {...state.tupdate};
            let txID = action.topicID;
            tups[txID] = action.status
            return {
                ...state,
                tupdate:tups
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
        case TOPIC_EDIT_SUCCESS:
            var idc = action.id;
            var datac = action.data.active;
            var newArrayc = [...state.topics];
            const isIndex = newArrayc.findIndex(x => x.id === idc);
            newArrayc && Array.isArray(newArrayc) && newArrayc[isIndex] ? newArrayc[isIndex].active =  datac: {};
            return {
                ...state,
                topics : newArrayc,
                isEdit : idc
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
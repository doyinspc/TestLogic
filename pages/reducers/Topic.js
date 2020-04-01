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


const numidConverter = (data) =>{
    let datas = [];
    data.forEach(row=>{
        let nums = row.numid;
        if(parseInt(nums) > 0)
        {
            //QUESTIONS AVAILABLE
            row['questionx'] = 1;
        }
        else if(parseInt(nums) == 0)
        {
            //NO QUESTIONS
            row['questionx'] = 2;
        }
        else
        {
            //ERROR
            row['questionx'] = 3;
        }
        datas.push(row);
    })
    return datas;
}

const numidConverterCompare = (offlineData, onlineData) =>{
    //STORE ALL NEW ROWS
    let newRowData = [];
    //NO ONLINE DATA : NETWORK ISSUES
    if(onlineData && Array.isArray(onlineData) && onlineData.length > 0)
    {
        //IF NO OFFLINE DATA
        if(offlineData && Array.isArray(offlineData) && offlineData.length > 0)
        {
            //IF BOTH OFFLINE AND ONLINE DATA ARE AVAILABLE
            //USE THOSE ONLINE TO COMPARE WITH THOSE OFFLINE
            //IF NOQ ONLINE IS MORE THAN NOQ OFFLINE : SET UPDATE AVAILABLE
            //IF BOTH ARE THE SAME : SET OK 
            //IF NOQ ONLINE IS LESS THAN NOQ OFFLINE : SET IGNORE

            //USE ONLINE TO LOOP THROUGH
            onlineData.forEach(row =>{
                //GET THE ROW FROM OFFLINE DATA
                let isIndex = offlineData.findIndex(x => x.id === row.id);
                if(isIndex && isIndex > -1)
                {
                    //IF THE ROW EXIST UPDATE IT 
                    //GET THE ONLINE AND OFFLINE QUETION NUMBER 
                    let offline = offlineData[isIndex].numid;
                    let online = row.numid;
                    //COMPARE
                    //BOTH NOQ ARE THE SAME AND MORE THAN ZERO
                    if(parseInt(online) === parseInt(offline) && parseInt(online)  > 0)
                    {
                        offlineData[isIndex].questionx = 1;
                    }
                    //ONLINE NOQ IS MORE THAN OFFLINE NOQ BUT BOTH ARE MORE THAN ZERO
                    else if(parseInt(online) > parseInt(offline)  && parseInt(online)  > 0)
                    {
                        if(parseInt(offline)  > 0)
                        {
                            offlineData[isIndex].questionx = 4;
                        }else{
                            offlineData[isIndex].questionx = 5;
                        }
                        
                    }
                    //NO QUESTIONS
                    else
                    {
                        offlineData[isIndex].questionx = 2;
                    }
                }
                else
                {
                    //CANNOT FIND ROW IN OFFLINE DATA
                    // ASSUME NEW ROW : STORE
                    newRowData.push(row);
                }
            })
                let prep_new_rows = numidConverter(newRowData);
                //COMBINE ROWS AND RETURN
                return [...offlineData, ...prep_new_rows ];
            
        }else
        {
            //NO ONLINE DATA : RETURN OFFLINE DATA 
            return numidConverter(onlineData);
        }
    }else
    {
        //NO ONLINE DATA : RETURN OFFLINE DATA 
        return numidConverter(offlineData);
    }
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
            newTopics = numidConverter(newTopics);
            return {
                ...state,
                topics :newTopics,
                isLoading: false
            };
        
        case TOPIC_DOWNLOADING_SUCCESS:
            let oldArray = [...state.topics];
            let onlineArray = action.payload;
            let newArrayx = numidConverterCompare(oldArray, onlineArray);
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
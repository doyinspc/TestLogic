import { 
    SUBJECT_GET_ONE, 
    SUBJECT_LOADING,
    SUBJECT_LOADING_ERROR,
    SUBJECT_GET_MULTIPLE,
    SUBJECT_DOWNLOADING, 
    SUBJECT_DOWNLOADING_SUCCESS, 
    SUBJECT_DOWNLOADING_FAIL,
       
} from "../types/Subject";
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const getUserId = async () => {
  let userId = '';
  try {
    userId = await AsyncStorage.getItem('user')
    .then(d=>{
       console.log(d)
       return d;
    })
    .catch(err =>{
      console.log(err);
    })
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
  return userId;
}

const db = DB_PATH;
const token = 'TOKEN';
const path = API_PATH;
const config = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.subject.name;
const TABLE_STRUCTURE = SCHEME.subject.schema;

let pa = getUserId();
console.log(`preserve ${JSON.stringify(pa)}`);
let pathx = pa.path_main;
//GET SUBJECTS FROM ONLINE DATABANK
export const getSubjectsDownload = () => (dispatch, getState) => {
  return new Promise((resolve, reject) =>{
  let paths = `${pathx}/api/`;
  let params = {
    data:{},
    cat:'all',
    table:TABLE_NAME,
    token:token
  }
  dispatch({ type: SUBJECT_DOWNLOADING });
  axios.get(paths, {params})
  .then(res => {
        loadData(res.data, SCHEME['subject'].name, SCHEME['subject'].edits)
          .then( d =>{
              if(res.data && Array.isArray(res.data) && res.data.length > 0 )
              {
                dispatch({type: SUBJECT_DOWNLOADING_SUCCESS, payload: res.data });
                resolve(res.data.length);
              }else
              {
                dispatch({type : SUBJECT_DOWNLOADING_FAIL,  msg : 'Not Saved' }) ;
                reject('Not Saved');
              } 
        }).catch(err =>{dispatch({type : SUBJECT_DOWNLOADING_FAIL, msg : err }); reject(JSON.stringify(err));})
      }).catch(err => {dispatch({type : SUBJECT_DOWNLOADING_FAIL, msg : err }); reject(JSON.stringify(err));})
    })
};

//GET ALL SUBJECT 
export const getSubjects = () => (dispatch) => {
  return new Promise((resolve, reject) =>{
    let PARAM={};
    dispatch({ type: SUBJECT_LOADING });
      db.selectPromise(TABLE_NAME, PARAM)
      .then(data =>{
        if(data._array && Array.isArray(data._array) && parseInt(data.length) > 0 )
        {
          dispatch({type: SUBJECT_GET_MULTIPLE, payload: data._array})
          resolve(data._array.length);
        }else
        {
          dispatch({ type : SUBJECT_LOADING_ERROR, msg : 'No Subject Offline'});
          reject('No Data')
        }
      })
      .catch(err=>reject(err))
    })
};

//SELECT SINGLE SUBJECT FROM SUBJECTS
export const getSubject = (id) => (dispatch) => {
  dispatch({ type: SUBJECT_GET_ONE, payload: id})
};

//GET SUBJECTS FROM ONLINE DATABANK
export const getSubjectsClear = () => (dispatch, getState) => {
          dropData('subject');        
          dropData('theme');
          dropData('topic');
          dropData('instruction');
          dropData('question');
          dropData('answer');
          dropData('distractor');
};

export const dropTable = table => (dispatch, getState) => {
  dropData(table);        
};

//SELECT ONE SUBJECT FROM DB
export const getSubjectDB = (id) => (dispatch, getState) => {
  dispatch({ type: SUBJECT_LOADING})
  db.select(TABLE_NAME, TABLE_STRUCTURE, id)
  .then((res) => {
    dispatch({
      type: SUBJECT_GET_ONE,
      payload: data
    })
  }).catch((err) => {
      dispatch({
        type : SUBJECT_LOADING_ERROR,
        payload: err
      })
  })
};


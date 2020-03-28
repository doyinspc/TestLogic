import { 
    SUBJECT_GET_ONE, 
    SUBJECT_LOADING,
    SUBJECT_LOADING_ERROR,
    SUBJECT_GET_MULTIPLE,
    SUBJECT_DOWNLOADING, 
    SUBJECT_DOWNLOADING_SUCCESS, 
    SUBJECT_DOWNLOADING_FAIL,
       
} from "../types/Subject";

import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.subject.name;
const TABLE_STRUCTURE = SCHEME.subject.schema;

//GET SUBJECTS FROM ONLINE DATABANK
export const getSubjectsDownload = () => (dispatch, getState) => {
  return new Promise((resolve, reject) =>{
  let paths = `${path}/subject/`
  dispatch({ type: SUBJECT_DOWNLOADING });
  axios.get(paths, config(getState))
      .then(async res => {
        await loadData(res.data, 'subject', async (d)=>{
          if(res.data && Array.isArray(res.data) && res.data.length > 0 )
          {
            await dispatch({type: SUBJECT_DOWNLOADING_SUCCESS, payload: res.data });
            resolve(res.data.length);
          }else
          {
            await dispatch({type : SUBJECT_DOWNLOADING_FAIL,  msg : 'Not Saved' }) ;
            reject('Not Saved')
          } 
        });
      })
      .catch(err => {
        dispatch({type : SUBJECT_DOWNLOADING_FAIL, msg : err })
        reject(err);
      })
    })
};

//GET ALL SUBJECT 
export const getSubjects = () => (dispatch) => {
  return new Promise((resolve, reject) =>{
    let PARAM= {};
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


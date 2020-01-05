import {
    SUBJECT_GET_MULTIPLE_ONLINE,
    SUBJECT_GET_MULTIPLE,
    SUBJECT_GET_ONE, 
    SUBJECT_LOADING,
    SUBJECT_LOADING_ERROR,
    SUBJECT_LOADING_ERROR_ONLINE,
    SUBJECT_LOADING_ONLINE
} from "../types/Subject";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.subject.name;
const TABLE_STRUCTURE = SCHEME.subject.schema;

//GET SUBJECTS FROM ONLINE DATABANK
export const getSubjectsCloud = () => (dispatch, getState) => {
  let paths = `${path}/subject/`
  dispatch({ type: SUBJECT_LOADING_ONLINE });
  axios.get(paths, subjectSetConfig(getState))
      .then(res => {
          loadData(res.data, 'subject', ()=>{
            if(res.data){
              dispatch({
                type: SUBJECT_GET_MULTIPLE_ONLINE,
                payload: res.data
              })
            }else
            {
              dispatch({
                type : SUBJECT_LOADING_ERROR_ONLINE,
                msg : err
              })
            }
            
          });
      })
      .catch(err => {
          dispatch({
              type : SUBJECT_LOADING_ERROR_ONLINE,
              msg : err
          })
      })
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

export const getTableClear = table => (dispatch, getState) => {
  dropData(table);        
};
//GET ALL SUBJECT 
export const getSubjects = () => (dispatch, getState) => {
      let PARAM= {};
      dispatch({ type: SUBJECT_LOADING });
      db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
        if(Array.isArray(data._array) && parseInt(data._length) > 0)
        {
          //cody
        }
        else if(data == 1)
        {
          dispatch({
            type : SUBJECT_LOADING_ERROR,
            msg : 'No file'
          })
        }
        else
        {
          dispatch({
            type: SUBJECT_GET_MULTIPLE,
            payload: data._array
          })
        }
        
      })
};

export const getSubject = (id) => (dispatch, getState) => {
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

loadSubjects  = (data) =>{
  return new Promise((resolve) => {
    data.forEach(element => {
      db.insert(TABLE_NAME, TABLE_STRUCTURE, element, (dat)=>{
        console.log(dat);
      })
      .then((dat) => {
        resolve(dat);
      })
      .catch((err) => {
        console.log(err);
      })
   });
  })
};

loadData  = (data, tables, callback) =>{
  const TABLES_NAME = SCHEME[tables].name;
  const TABLES_STRUCTURE = SCHEME[tables].schema;
  let dt  = [];
    data.forEach(element => {
      db.insert(TABLES_NAME, TABLES_STRUCTURE, element, (data)=>{
        if(data == 'xx')
        {
          // failed to insert
        }
        else if(data > 0)
        {
          console.log(`${TABLES_NAME} DONE ${data}`)
          dt.push(data);
        }
      })
   });
   callback(dt);
   console.log(dt);
};

dropData  = (tables) =>{
  const TABLES_NAME = SCHEME[tables].name;
  const TABLES_STRUCTURE = SCHEME[tables].schema;
  return new Promise((resolve) => {
    db.drop(TABLES_NAME, TABLES_STRUCTURE, (data)=>{
        console.log(`Table Droped : ${TABLES_NAME}`);
    })
    .then((dat) => {
      console.log(dat);
      resolve(dat);
    })
    .catch((err) => {
      console.log(err);
    })
  })
};

  //SET TOKEN AND HEADER - HELPER FUNCTION
export const subjectSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

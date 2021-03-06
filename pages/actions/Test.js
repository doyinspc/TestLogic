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
} from "../types/Test";


import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, LOADDATASTRIP } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;   
const config = CONFIG;
const loadData = LOADDATA;
const loadDataStrip = LOADDATA;

const TABLE_NAME = SCHEME.test.name;
const TABLE_STRUCTURE = SCHEME.test.schema;


//GET SUBJECTS FROM ONLINE DATABANK
export const getTestDownload = (subjectID) => (dispatch, getState) => {
  let paths = `${path}/test/pull`;
  dispatch({ type: TEST_DOWNLOADING });
  let PARAM = {
    userID : userID,
    subjectID : subjectID,
    data : data,
  }
  axios.patch(paths, PARAM, config(getState))
      .then(res => {
        loadDataStrip(res.data, 'test', ()=>{
          res.data ? dispatch({type: TEST_DOWNLOADING_SUCCESS, payload: res.data }) : dispatch({type : TEST_DOWNLOADING_FAIL,  msg : 'Not Sac' }) ;
        });
      })
      .catch(err => {dispatch({type : TEST_DOWNLOADING_FAIL, msg : err })
      })
};

//GET ALL TEST
export const getTestUpload = (subjectID) => (dispatch) =>{
  dispatch({ type: TEST_UPLOADING});
  let paths = `${path}/test/push`;
  let PARAM = {
    userID : userID,
    subjectID : subjectID
  }
  db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
    let PARAMS = {
      userID : userID,
      data : data,
    }
    axios.patch(paths, PARAMS, config(getState))
    .then(res => {
      dispatch({type : TEST_UPLOADING_SUCCESS })
    })
    .catch(err => {dispatch({type : TEST_UPLOADING_FAIL, msg : err })
    })
  })
};


//GET ALL TEST
export const getTests = (testID) => (dispatch) => {
    let PARAM = {subjectID : [testID],};
    dispatch({ type: TEST_LOADING});
    db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      data == 1 ?  dispatch({type: TEST_LOADING_ERROR, msg:'error'}) : dispatch({type: TEST_GET_MULTIPLE, payload:data._array});
    })
};

//SELECT SINGLE THEME FROM THEMES
export const getTest = (id) => (dispatch) => {
  dispatch({ type: TEST_GET_ONE, payload: id})
};

//SELECT SINGLE FROM OFFLINE DB
export const getTestPromise = (id) => (dispatch) => {
  return new Promise((resolve, reject)=>{
    db.selectPromise(TABLE_NAME, {'id':id })
    .then(dat=>{
        if(dat && Array.isArray(dat._array) && dat._array.length > 0)
        {
          dispatch({type: TEST_DOWNLOADING_SUCCESS, payload:dat._array, id:dat})
          dispatch({ type: TEST_GET_ONE, payload:id})
          resolve(dat._array[0]);
        }
        else
        {
          let e = new Error('No File');
          reject(e);
        }
    })
    .catch(err=>{
        dispatch({type: TEST_INSERT_FAIL,  msg:err});
        reject(err);
    })
  }) 
};

export const getTestDB = (id) => (dispatch) => {
  return new Promise((resolve, reject)=>{
    db.selectPromise(TABLE_NAME, {'id':id })
    .then(dat=>{
        if(dat && Array.isArray(dat._array) && dat._array.length > 0)
        {
          dispatch({type: TEST_DOWNLOADING_SUCCESS, payload:dat._array, id:dat})
          dispatch({ type: TEST_GET_ONE, payload:id})
          resolve(dat._array[0]);
        }
        else
        {
          let e = new Error('No File');
          reject(e);
        }
    })
    .catch(err=>{
        dispatch({type: TEST_INSERT_FAIL,  msg:err});
        reject(err);
    })
  }) 
};

export const insertTestPromise = (data) => (dispatch) => {
  dispatch({ type: TEST_INSERT_LOADING});
  db.insertTest(TABLE_NAME, TABLE_STRUCTURE, data, 1, (dat) =>{
    callback(dat);
    dat == 0 ? dispatch({type: TEST_INSERT_FAIL, msg: 'none'}) : dispatch({type: TEST_INSERT_SUCCESS, payload:data, id:dat});
  })
};

export const insertTest = (data) => (dispatch) => {
  dispatch({ type: TEST_INSERT_LOADING});
    return new Promise((resolve, reject)=>{
      db.insertTestPromise(TABLE_NAME, data)
      .then(dat=>{
        dispatch({type: TEST_INSERT_SUCCESS, payload:data, id:dat})
        resolve(dat);
      })
      .catch(err=>{
        dispatch({type: TEST_INSERT_FAIL,  msg:err});
        reject(err);
      })
  })
};

export const updateTest = (data, id) => (dispatch) => {
  dispatch({ type: TEST_UPDATE_LOADING});
    return new Promise((resolve, reject)=>{
      db.updatePromise(TABLE_NAME, data, id)
      .then(dat=>{
        dispatch({type: TEST_UPDATE_SUCCESS, payload: data, id:id});
        resolve(id);
      })
      .catch(err=>{
        console.log(err);
        dispatch({type: TEST_UPDATE_FAIL,  msg:err});
        reject(id);
      })
  })
};

export const deleteTest = (id) => (dispatch) => {
  db.delete(TABLE_NAME, TABLE_STRUCTURE, id, (dat) => {
    dat == 0 ? dispatch({type: TEST_DELETE_SUCCESS}) : dispatch({type: TEST_DELETE_FAIL});
  })
};
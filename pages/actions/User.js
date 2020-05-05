import {
    USER_GET_MULTIPLE,
    USER_UPLOADING,
    USER_UPLOADING_FAIL,
    USER_UPLOADING_SUCCESS,
    USER_GET_ONE, 
    USER_LOADING,
    USER_LOADING_ERROR
} from "../types/User";


import axios from 'axios';
import { USER_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';
var md5 = require('md5');


const db = DB_PATH;
const path = USER_PATH;
const token = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.user.name;
const TABLE_STRUCTURE = SCHEME.user.schema;



//GET ALL USER
export const postUser = (user) => (dispatch, getState) => {
    return new Promise((resolve, reject)=>{
    let paths = `${path}/api/register/`;
    let params = {
      data:user,
      cat:'all',
      table:TABLE_NAME,
      token:token
    }
    dispatch({ type: USER_UPLOADING });
    axios.post(paths, {params})
      .then(async res => {
        let arr = [];
        arr.push(res.data);
        await loadData(arr, 'users')
        .then(async (d)=>{
         if(res.data){
            await dispatch({type: USER_UPLOADING_SUCCESS, payload: res.data })
            resolve(res.data);
          }else{
            await dispatch({type : USER_UPLOADING_FAIL,  msg : 'Not Saved' }) ;
            reject('Not Saved');
          }
        })
        .catch(async err=>{
          await dispatch({type : USER_UPLOADING_FAIL,  msg : 'Not Saved' }) ;
          reject(JSON.stringify(err));
        })
      })
      .catch(err => {
          reject(JSON.stringify(err));
      })
    })
};

//GET ALL USER 
export const getUser = user => (dispatch) => {
  dispatch({ type: USER_LOADING });
  return new Promise((resolve, reject)=>{
    if(user  && Object.keys(user).length > 0)
    {
      let { uniqueid , passw } = user;
      let passws = md5(passw);
      let PARAM = { uniqueid, passw:passws };
      db.selectPromise(TABLE_NAME, PARAM)
      .then(data=>{
        if(data._array && Array.isArray(data._array) && parseInt(data.length) > 0)
        {
          dispatch({type: USER_GET_MULTIPLE, payload: data._array});
          resolve(data._array[0]);
        }else
        {
          dispatch({ type : USER_LOADING_ERROR, msg : 'No file'});
          reject('Going online..');
        }
      })
      .catch(err=>{
          dispatch({ type : USER_LOADING_ERROR, msg : JSON.stringify(err)});
          reject(JSON.stringify(err));
      })
    }else
    {
      reject('No Data');
    }
 })
};


//GET ALL USER 
export const getUserOne = () => (dispatch) => {
  dispatch({ type: USER_LOADING });
  return new Promise((resolve, reject)=>{
      let PARAM = { active:1 };
      db.selectPromise(TABLE_NAME, PARAM)
      .then(data=>{
        if(data._array && Array.isArray(data._array) && parseInt(data.length) > 0)
        {
          dispatch({type: USER_GET_MULTIPLE, payload: data._array[0]});
          resolve(data._array[0]);
        }else
        {
          dispatch({ type : USER_LOADING_ERROR, msg : 'No file'});
          reject('Going online..');
        }
      })
      .catch(err=>{
          dispatch({ type : USER_LOADING_ERROR, msg : JSON.stringify(err)});
          reject(JSON.stringify(err));
      })
 })
};

//GET ALL USER 
export const getUse = (user) => (dispatch) => {
  let PARAM = {
    email:user.email,
    password:user.password,
    social: 3,
  };
  dispatch({ type: USER_LOADING });
  db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, async (data)=>{
    data._array && Array.isArray(data._array) && parseInt(data.length) > 0 ? await dispatch({type: USER_GET_ONE, payload: data._array}): dispatch({ type : USER_LOADING_ERROR, msg : 'No file'});
  })
};



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
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.user.name;
const TABLE_STRUCTURE = SCHEME.user.schema;

//CREATE A NEW USER 

//UPDATE USER PASSWORD

//SAVE USER DATA ONLINE

//GET TOKEN KEY ONLINE

//UPDATE TOKEN KEY OFFLINE

//DOWNLOAD AND SAVE PAYMENT DETAILS OFFLINE

//DOWNLOAD AND SAVE USER CREDIT OFFLINE

//SAVE USER DEBIT OFFLINE

//SAVE USER DEBIT ONLINE

//GET ALL USER
export const postUser = (user) => (dispatch, getState) => {
    let paths = `${path}/user/post/1`;
    dispatch({ type: USER_UPLOADING });
    let body = {user:user};
    axios.patch(paths, body, config(getState))
      .then(async res => {
        await loadData(res.data, 'user', async (d)=>{
          console.log(res.data);
          res.data ? await dispatch({type: USER_UPLOADING_SUCCESS, payload: res.data }) : await dispatch({type : SUBJECT_DOWNLOADING_FAIL,  msg : 'Not Saved' }) ;
        });
      })
      .catch(err => {dispatch({type : USER_UPLOADING_FAIL, msg : err })
      })
};

//GET ALL USER 
export const getUser = () => (dispatch) => {
  let PARAM = {};
  dispatch({ type: USER_LOADING });
  db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, async (data)=>{
    data._array && Array.isArray(data._array) && parseInt(data.length) > 0 ? await dispatch({type: USER_GET_MULTIPLE, payload: data._array}): dispatch({ type : USER_LOADING_ERROR, msg : 'No file'});
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



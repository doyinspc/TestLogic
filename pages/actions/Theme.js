import {
    THEME_GET_MULTIPLE,
    THEME_GET_ONE, 
    THEME_LOADING,
    THEME_LOADING_ERROR 
} from "../types/Theme";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.theme.name;
const TABLE_STRUCTURE = SCHEME.theme.schema;

//GET THEMES FROM ONLINE DATABANK
export const getThemesCloud = (num) => (dispatch, getState) => {
  let paths = `${path}/theme/cloud/${num}`
  axios.get(paths, themeSetConfig(getState))
      .then(res => {
          loadData(res.data, 'theme');
      })
      .catch(err => {
          dispatch({
              type : THEME_LOADING_ERROR,
              payload: err
          })
      })
};

export function getThemesID(num, callback){
 
  let paths = `${path}/theme/cat/${num}`;
  axios.get(paths, themeSetConfig(null))
      .then(res => {
        loadData(res.data, 'theme');
        callback(res.data)
      })
      .catch(err => {
          console.log(err.message);
      })
};

export function getTopicsID(num, callback){
  let paths = `${path}/topic/mult/n`;
  let d = {
    data: num.join(',')
  };
  axios.patch(paths, d, themeSetConfig(null))
      .then(res => {
        loadData(res.data, 'topic');
        callback(res.data)
      })
      .catch(err => {
          console.log(err.message);
      })
};

export function getInstructionsID(num, callback){
  let paths = `${path}/instruction/mult/n`;
  let d = {
    data: num.join(',')
  };
  axios.patch(paths, d, themeSetConfig(null))
      .then(res => {
        loadData(res.data, 'instruction');
        callback(res.data)
      })
      .catch(err => {
          console.log(err.message);
      })
};

export function getQuestionsID(num, callback){
  let paths = `${path}/question/mult/n`;
  let d = {
    data: num.join(',')
  };
  axios.patch(paths, d, themeSetConfig(null))
      .then(res => {
        loadData(res.data, 'question');
        callback(res.data)
      })
      .catch(err => {
          console.log(err);
      })
};

export function getAnswersID(num, callback){
  let paths = `${path}/answer/mult/n`;
  let d = {
    data: num.join(',')
  };
  let body = JSON.stringify({data: num.join(',')});
  axios.patch(paths, d, themeSetConfig(null))
      .then(res => {
        loadData(res.data, 'answer');
        callback(res.data)
      })
      .catch(err => {
          console.log(err);
      })
};

export function getDistractorsID(num, callback){
  let paths = `${path}/distractor/mult/n`;
  let d = {
    data: num.join(',')
  };
  axios.patch(paths, d, themeSetConfig(null))
      .then(res => {
        loadData(res.data, 'distractor');
        callback(res.data)
      })
      .catch(err => {
          console.log(err.message);
      })
};



//GET ALL THEME 
export const getThemes = (subject) => (dispatch, getState) => {
    let PARAM = {
      subjectID : subject,
    };
      dispatch({ type: THEME_LOADING})
      db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
        dispatch({
          type: THEME_GET_MULTIPLE,
          payload: data._array
        })
      })
};

export const getTheme = (id) => (dispatch, getState) => {
  dispatch({ type: THEME_LOADING})
  db.select(TABLE_NAME, TABLE_STRUCTURE, id).then((res) => {
    dispatch({
      type: THEME_GET_ONE,
      payload: data
    })
  }).catch((err) => {
      dispatch({
        type : THEME_LOADING_ERROR,
        payload: err
      })
  })
};

loadData  = (data, tables) =>{
  const TABLES_NAME = SCHEME[tables].name;
  const TABLES_STRUCTURE = SCHEME[tables].schema;
  let I  = 0;
  return new Promise((resolve) => {
    db.initDB(TABLES_NAME, TABLES_STRUCTURE);
    dbs = db.openDB();
    data.forEach(element => {
      db.insert(dbs, TABLES_NAME, TABLES_STRUCTURE, element, (dat)=>{
        console.log(`${TABLES_NAME} DONE ${++I}`)
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

dropThemes  = () =>{
  return new Promise((resolve) => {
    db.drop(TABLE_NAME, TABLE_STRUCTURE, (data)=>{
        console.log('Table Droped');
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
export const themeSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

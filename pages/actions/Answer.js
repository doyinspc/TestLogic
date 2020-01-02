import {
    ANSWER_GET_MULTIPLE,
    ANSWER_GET_ONE, 
    ANSWER_LOADING,
    ANSWER_LOADING_ERROR 
} from "../types/Answer";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.answer.name;
const TABLE_STRUCTURE = SCHEME.answer.schema;

//GET ANSWERS FROM ONLINE DATABANK
export const getAnswersCloud = (num) => (dispatch, getState) => {
  let paths = `${path}/answer/cloud/${num}`
  axios.get(paths, answerSetConfig(getState))
      .then(res => {
          loadAnswers(res.data);
      })
      .catch(err => {
          dispatch({
              type : ANSWER_LOADING_ERROR,
              payload: err
          })
      })
};
//GET ALL ANSWER 
export const getAnswers = () => (dispatch, getState) => {
    let PARAM= {};
      dispatch({ type: ANSWER_LOADING})
      db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
        dispatch({
          type: ANSWER_GET_MULTIPLE,
          payload: data._array
        })
      })
};

export const getAnswer = (id) => (dispatch, getState) => {
  dispatch({ type: ANSWER_LOADING})
  db.select(TABLE_NAME, TABLE_STRUCTURE, id).then((res) => {
    dispatch({
      type: ANSWER_GET_ONE,
      payload: data
    })
  }).catch((err) => {
      dispatch({
        type : ANSWER_LOADING_ERROR,
        payload: err
      })
  })
};

loadAnswers  = (data) =>{
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

dropAnswers  = () =>{
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
export const answerSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

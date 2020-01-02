import {
    QUESTION_GET_MULTIPLE,
    QUESTION_GET_ONE, 
    QUESTION_LOADING,
    QUESTION_LOADING_ERROR 
} from "../types/Question";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.question.name;
const TABLE_STRUCTURE = SCHEME.question.schema;

//GET QUESTIONS FROM ONLINE DATABANK
export const getQuestionsCloud = (num) => (dispatch, getState) => {
  let paths = `${path}/question/cloud/${num}`
  axios.get(paths, questionSetConfig(getState))
      .then(res => {
          loadQuestions(res.data);
      })
      .catch(err => {
          dispatch({
              type : QUESTION_LOADING_ERROR,
              payload: err
          })
      })
};
//GET ALL QUESTION 
export const getQuestions = () => (dispatch, getState) => {
    let PARAM= {};
      dispatch({ type: QUESTION_LOADING})
      db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
        dispatch({
          type: QUESTION_GET_MULTIPLE,
          payload: data._array
        })
      })
};

export const getQuestion = (id) => (dispatch, getState) => {
  dispatch({ type: QUESTION_LOADING})
  db.select(TABLE_NAME, TABLE_STRUCTURE, id).then((res) => {
    dispatch({
      type: QUESTION_GET_ONE,
      payload: data
    })
  }).catch((err) => {
      dispatch({
        type : QUESTION_LOADING_ERROR,
        payload: err
      })
  })
};

loadQuestions  = (data) =>{
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

dropQuestions  = () =>{
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
export const questionSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

import {
    SCORE_GET_MULTIPLE,
    SCORE_GET_ONE, 
    SCORE_LOADING,
    SCORE_LOADING_ERROR,
    SCORE_GET_QUESTIONS
} from "../types/Score";


import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, LOADDATASTRIP } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;   
const config = CONFIG;
const loadData = LOADDATA;
const loadDataStrip = LOADDATA;

const TABLE_NAME = SCHEME.score.name;
const TABLE_STRUCTURE = SCHEME.score.schema;


//GET ALL SCORE
export const getScores = (scoreID) => (dispatch, getState) => {
    let PARAM = {
      testID : parseInt(scoreID)
    };
    dispatch({ type: SCORE_LOADING})
    db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      dispatch({
        type: SCORE_GET_MULTIPLE,
        payload: data._array
      })
    })
};
//GET SINGLE SCORE
export const getScorex = (id) => (dispatch, getState) => {
    let PARAM = {
      id : id,
    };
    dispatch({ type: SCORE_LOADING})
    db.selectOne(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      dispatch({
        type: SCORE_GET_ONE,
        payload: data._array
      })
    })
};

export const getScore = (thm) => (dispatch, getState) => {

  let PARAM = {
    id : parseInt(thm)
  };
  
  dispatch({ type: SCORE_LOADING})
  db.selectOne(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
    dispatch({
      type: SCORE_GET_ONE,
      payload: data._array[0],
      id: thm
    })
  })
};


//SELECT SINGLE FROM OFFLINE DB
export const getScorePromise = (id) => (dispatch) => {
  return new Promise((resolve, reject)=>{
    db.selectPromise(TABLE_NAME, {'id':id })
    .then(dat=>{
        if(dat && Array.isArray(dat._array) && dat._array.length > 0)
        {
          
          dispatch({ type: SCORE_GET_ONE, payload:id});
          resolve(dat._array[0]);
        }
        else
        {
          let e = new Error('No File');
          reject(e);
        }
    })
    .catch(err=>{
        reject(err);
    })
  }) 
};

//GET SINGLE SCORE
export const insertScore = (PARAM) =>(dispatch, getState) =>{
  return new Promise((resolve, reject)=>{
  db.insertTestPromise(TABLE_NAME, PARAM)
  .then(data =>{
       dispatch({type: SCORE_GET_ONE, id: data});
       resolve(data);
    })
    .catch(err =>{
      reject(err)
    })
  })
};

//GET SINGLE SCORE
export const updateScore = (PARAM, id) =>(dispatch, getState) =>{
  return new Promise((resolve, reject)=>{
    db.updatePromise(TABLE_NAME, PARAM, id)
    .then(data =>{
         dispatch({type: SCORE_GET_ONE, id: data});
         resolve(data);
      })
      .catch(err =>{
        reject(err)
      })
    })
};


//SET TOKEN AND HEADER - HELPER FUNCTION
export const scoreSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

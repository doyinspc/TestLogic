import {
    SCORE_GET_MULTIPLE,
    SCORE_GET_ONE, 
    SCORE_LOADING,
    SCORE_LOADING_ERROR,
    SCORE_GET_QUESTIONS
} from "../types/Score";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

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

//GET SINGLE SCORE
export const insertScore = (PARAM, callback) =>(dispatch, getState) =>{
  db.insertScore(TABLE_NAME, TABLE_STRUCTURE, PARAM, 1, (data)=>{
    callback(data);
    dispatch({
      type: SCORE_GET_ONE,
      id: data
    })
  })
};

//GET SINGLE SCORE
export const updateScore = (PARAM, st, callback) =>(dispatch, getState) =>{
  db.updateScore(TABLE_NAME, TABLE_STRUCTURE, PARAM, st, (data)=>{
    dispatch({
      type: SCORE_GET_ONE,
      id: data
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

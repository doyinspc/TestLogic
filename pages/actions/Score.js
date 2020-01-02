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
      testID : scoreID
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
export const getScore = (id) => (dispatch, getState) => {
    let PARAM = {
      id : id,
    };
    dispatch({ type: SCORE_LOADING})
    db.selectOne(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      console.log(data);
      dispatch({
        type: SCORE_GET_ONE,
        payload: data._array
      })
    })
};

export const getQuestionsSave = (data) => (dispatch, getState) => {
  db.initDB(TABLES_NAME, TABLES_STRUCTURE);
  let dbs = db.openDB();
  db.insertScore(dbs, TABLES_NAME, TABLES_STRUCTURE, 1, data)
  .then((dat) => {
    dispatch({
      type: SCORE_GET_ONE,
      payload: dat
    })
  })
  .catch((err) => {
    dispatch({
      type : SCORE_LOADING_ERROR,
      payload: err
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

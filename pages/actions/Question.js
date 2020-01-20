import {
    QUESTION_GET_MULTIPLE,
    QUESTION_LOADING,
    QUESTION_LOADING_ERROR 
} from "../types/Question";


import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.question.name;
const TABLE_STRUCTURE = SCHEME.question.schema;


//GET ALL QUESTIONS
//ARGUMENTS TOPICS AND NUMBER OF QUESTIONS;
//ENGLISH PASSAGES AND CLOZE BE TREATED DIFFERENTLY
//OTHERS CAN BE SELECTED RANDOMLY
export const getQuestions = (topicsID, NUM, callback) => (dispatch) => {
  let topics_array = topicsID.toString();
  let PARAM = topicsID;
  dispatch({ type: QUESTION_LOADING});
  db.selectQuestions(TABLE_NAME, TABLE_STRUCTURE, PARAM, NUM, (data)=>{
    console.log(data);
    callback(data);
    data == 1 ?  dispatch({type: QUESTION_LOADING_ERROR, msg:'error'}) :  dispatch({type: QUESTION_GET_MULTIPLE, payload: data._array});
  })
};

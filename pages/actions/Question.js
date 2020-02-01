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
    callback(data);
    data == 1 ?  dispatch({type: QUESTION_LOADING_ERROR, msg:'error'}) :  dispatch({type: QUESTION_GET_MULTIPLE, payload: data._array});
  })
};

export const getQuestionsx = (topicsID, NUM, callback) => (dispatch) => {
  let topics_array = topicsID.toString();
  let PARAM = topicsID;

  dispatch({ type: QUESTION_LOADING});
  dispatch({type: QUESTION_LOADING_ERROR, msg:'Starting.....'}) 
  db.selectIN('instructions', TABLE_STRUCTURE, {topicID:topicsID}, (inst)=>{
    inst == 1 ?  dispatch({type: QUESTION_LOADING_ERROR, msg:'error'}) :  dispatch({type: QUESTION_GET_MULTIPLE, msg:'instructions'});
    let instructionID = [];
    let instructions = inst._array;
    instructions.map((row) =>(instructionID.push(row.id)));
    db.selectINS('questions', TABLE_STRUCTURE, {instructionID:instructionID}, NUM, (que)=>{
      que == 1 ?  dispatch({type: QUESTION_LOADING_ERROR, msg:'error'}) :  dispatch({type: QUESTION_GET_MULTIPLE, msg:'questions'});
      let questionID = [];
      let questions = que._array;
      questions.map((row) =>(questionID.push(row.id)));

      db.selectIN('answers', TABLE_STRUCTURE, {questionID:questionID}, (ans)=>{
        ans == 1 ?  dispatch({type: QUESTION_LOADING_ERROR, msg:'error'}) :  dispatch({type: QUESTION_GET_MULTIPLE, msg:'answer'});
        let answerID = [];
        let answers = ans._array;
        answers.map((row) =>(answerID.push(row.id)));

        db.selectIN('distractors', TABLE_STRUCTURE, {questionID:questionID}, (dis)=>{
          dis == 1 ?  dispatch({type: QUESTION_LOADING_ERROR, msg:'error'}) :  dispatch({type: QUESTION_GET_MULTIPLE, msg:'distractor'});
          let distractorID = [];
          let distractors = dis._array;
          distractors.map((row) =>(distractorID.push(row.id)));
          callback([instructions, questions, answers, distractors])
          dispatch({ type: QUESTION_LOADING_ERROR});
        });

      })

     
      
    })
  })
};

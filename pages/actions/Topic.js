import {
    TOPIC_GET_MULTIPLE,
    TOPIC_GET_ONE, 
    TOPIC_LOADING,
    TOPIC_LOADING_ERROR,
    TOPIC_GET_QUESTIONS
} from "../types/Topic";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.topic.name;
const TABLE_STRUCTURE = SCHEME.topic.schema;

//GET TOPICS FROM ONLINE DATABANK
export const getTopicsCloud = (num) => (dispatch, getState) => {
  let paths = `${path}/topic/cloud/${num}`
  axios.get(paths, topicSetConfig(getState))
      .then(res => {
          loadTopics(res.data);
      })
      .catch(err => {
          dispatch({
              type : TOPIC_LOADING_ERROR,
              payload: err
          })
      })
};

//GET ALL TOPIC
export const getTopics = (theme) => (dispatch, getState) => {
    let thm = theme.split(',');
    let PARAM = {
      themeID : thm,
    };
    dispatch({ type: TOPIC_LOADING})
    db.selectIN(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      dispatch({
        type: TOPIC_GET_MULTIPLE,
        payload: data._array
      })
    })
};

//GET ALL TOPIC
export const getQuestions = (instruction) => (dispatch, getState) => {
  console.log(instruction);
  let inst = instruction.split(',')
  console.log(inst);
  let PARAM = {
    instructionID : inst
  };
  dispatch({ type: TOPIC_LOADING})
  db.selectQuestions(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
    dispatch({
      type: TOPIC_GET_QUESTIONS, 
      payload: data._array
    })
  })
};

export const getQuestionsSave = (data) => (dispatch, getState) => {
  dispatch({ type: TOPIC_LOADING});
  const TABLES_NAME = SCHEME['test'].name;
  const TABLES_STRUCTURE = SCHEME['test'].schema;
  
  db.insertTest(TABLES_NAME, TABLES_STRUCTURE, data, 1)
  .then((dat) => {
    dispatch({
      type: TOPIC_GET_ONE,
      payload: dat
    })
  })
  .catch((err) => {
    dispatch({
      type : TOPIC_LOADING_ERROR,
      payload: err
    })
  })
};

export const getQuestionsUpdate = (data) => (dispatch, getState) => {
  dispatch({ type: TOPIC_LOADING});
  const TABLES_NAME = SCHEME['test'].name;
  const TABLES_STRUCTURE = SCHEME['test'].schema;
  
  db.insertTest(TABLES_NAME, TABLES_STRUCTURE, data, 2, (data)=>{
    dispatch({
      type: TOPIC_GET_ONE,
      payload: data
    })
  })
 
};



export const getTopic = (id) => (dispatch, getState) => {
  dispatch({ type: TOPIC_LOADING})
  db.select(TABLE_NAME, TABLE_STRUCTURE, id).then((res) => {
    dispatch({
      type: TOPIC_GET_ID,
      payload: data
    })
  }).catch((err) => {
      dispatch({
        type : TOPIC_LOADING_ERROR,
        payload: err
      })
  })
};

loadSingle  = (data, tables) =>{
  const TABLES_NAME = SCHEME[tables].name;
  const TABLES_STRUCTURE = SCHEME[tables].schema;
  let I  = 0;
  return new Promise((resolve, reject) => {
    db.initDB(TABLES_NAME, TABLES_STRUCTURE);
    dbs = db.openDB();
      db.insert(dbs, TABLES_NAME, TABLES_STRUCTURE, data)
      .then((dat) => {
        resolve(dat);
      })
      .catch((err) => {
        reject(err);
      })
  })
};

loadTopics  = (data) =>{
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

dropTopics  = () =>{
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
export const topicSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

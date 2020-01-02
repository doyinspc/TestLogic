import {
    DISTRACTOR_GET_MULTIPLE,
    DISTRACTOR_GET_ONE, 
    DISTRACTOR_LOADING,
    DISTRACTOR_LOADING_ERROR 
} from "../types/Distractor";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.distractor.name;
const TABLE_STRUCTURE = SCHEME.distractor.schema;

//GET DISTRACTORS FROM ONLINE DATABANK
export const getDistractorsCloud = (num) => (dispatch, getState) => {
  let paths = `${path}/distractor/cloud/${num}`
  axios.get(paths, distractorSetConfig(getState))
      .then(res => {
          loadDistractors(res.data);
      })
      .catch(err => {
          dispatch({
              type : DISTRACTOR_LOADING_ERROR,
              payload: err
          })
      })
};

//GET ALL DISTRACTOR 
export const getDistractors = () => (dispatch, getState) => {
    let PARAM= {};
      dispatch({ type: DISTRACTOR_LOADING})
      db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
        dispatch({
          type: DISTRACTOR_GET_MULTIPLE,
          payload: data._array
        })
      })
};

export const getDistractor = (id) => (dispatch, getState) => {
  dispatch({ type: DISTRACTOR_LOADING})
  db.select(TABLE_NAME, TABLE_STRUCTURE, id).then((res) => {
    dispatch({
      type: DISTRACTOR_GET_ONE,
      payload: data
    })
  }).catch((err) => {
      dispatch({
        type : DISTRACTOR_LOADING_ERROR,
        payload: err
      })
  })
};

loadDistractors  = (data) =>{
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

dropDistractors  = () =>{
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
export const distractorSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

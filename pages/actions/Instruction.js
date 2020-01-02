import {
    INSTRUCTION_GET_MULTIPLE,
    INSTRUCTION_GET_ONE, 
    INSTRUCTION_LOADING,
    INSTRUCTION_LOADING_ERROR 
} from "../types/Instruction";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.instruction.name;
const TABLE_STRUCTURE = SCHEME.instruction.schema;

//GET INSTRUCTIONS FROM ONLINE DATABANK
export const getInstructionsCloud = (num) => (dispatch, getState) => {
  let paths = `${path}/instruction/cloud/${num}`
  axios.get(paths, instructionSetConfig(getState))
      .then(res => {
          loadInstructions(res.data);
      })
      .catch(err => {
          dispatch({
              type : INSTRUCTION_LOADING_ERROR,
              payload: err
          })
      })
};
//GET ALL INSTRUCTION 
export const getInstructions = () => (dispatch, getState) => {
    let PARAM= {};
      dispatch({ type: INSTRUCTION_LOADING})
      db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
        dispatch({
          type: INSTRUCTION_GET_MULTIPLE,
          payload: data._array
        })
      })
};

export const getInstruction = (id) => (dispatch, getState) => {
  dispatch({ type: INSTRUCTION_LOADING})
  db.select(TABLE_NAME, TABLE_STRUCTURE, id).then((res) => {
    dispatch({
      type: INSTRUCTION_GET_ONE,
      payload: data
    })
  }).catch((err) => {
      dispatch({
        type : INSTRUCTION_LOADING_ERROR,
        payload: err
      })
  })
};

loadInstructions  = (data) =>{
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

dropInstructions  = () =>{
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
export const instructionSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

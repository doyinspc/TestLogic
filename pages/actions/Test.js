import {
    TEST_GET_MULTIPLE,
    TEST_GET_ONE, 
    TEST_LOADING,
    TEST_LOADING_ERROR
} from "../types/Test";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.test.name;
const TABLE_STRUCTURE = SCHEME.test.schema;


//GET ALL TEST
export const getTests = (testID) => (dispatch, getState) => {
    let PARAM = {
      subjectID : testID,
    };
    dispatch({ type: TEST_LOADING});
    db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      dispatch({
        type: TEST_GET_MULTIPLE,
        payload: data._array
      })
    })
};
//GET SINGLE TEST
export const getTest = (thm) => (dispatch, getState) => {
    let PARAM = {
      id : parseInt(thm)
    };
    dispatch({ type: TEST_LOADING})
    db.selectOne(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      dispatch({
        type: TEST_GET_ONE,
        payload: data._array[0],
        id: thm
      })
    })
};



//SET TOKEN AND HEADER - HELPER FUNCTION
export const testSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

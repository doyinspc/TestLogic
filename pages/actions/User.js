import {
    USER_GET_MULTIPLE,
    USER_GET_ONE, 
    USER_LOADING,
    USER_LOADING_ERROR
} from "../types/User";


import Database from './../api/Database';
import axios from 'axios';
import { API_PATH } from './Common';
import  SCHEME  from './../api/Schema';
const db = new Database();
const path = API_PATH;

const TABLE_NAME = SCHEME.user.name;
const TABLE_STRUCTURE = SCHEME.user.schema;

//CREATE A NEW USER 

//UPDATE USER PASSWORD

//SAVE USER DATA ONLINE

//GET TOKEN KEY ONLINE

//UPDATE TOKEN KEY OFFLINE

//DOWNLOAD AND SAVE PAYMENT DETAILS OFFLINE

//DOWNLOAD AND SAVE USER CREDIT OFFLINE

//SAVE USER DEBIT OFFLINE

//SAVE USER DEBIT ONLINE

//GET ALL USER
export const getUsers = (userID) => (dispatch, getState) => {
    let PARAM = {
      subjectID : userID,
    };
    dispatch({ type: USER_LOADING});
    db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      dispatch({
        type: USER_GET_MULTIPLE,
        payload: data._array
      })
    })
};

//GET SINGLE USER
export const getUser = (thm) => (dispatch, getState) => {
    let PARAM = {
      id : parseInt(thm)
    };
    dispatch({ type: USER_LOADING})
    db.selectOne(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      dispatch({
        type: USER_GET_ONE,
        payload: data._array[0],
        id: thm
      })
    })
};

//SET TOKEN AND HEADER - HELPER FUNCTION
export const userSetConfig = () => {
  // headers
  const config ={
      headers:{
          
      }
  }
  return config
}

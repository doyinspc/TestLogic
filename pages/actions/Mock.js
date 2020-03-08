import {
    MOCK_GET_MULTIPLE,
    MOCK_GET_ONE, 
    MOCK_LOADING,
    MOCK_LOADING_ERROR,
    MOCK_DOWNLOADING,
    MOCK_DOWNLOADING_SUCCESS,
    MOCK_DOWNLOADING_FAIL,
    MOCK_GET_SELECTED
} from "../types/Mock";

import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.mock.name;
const TABLE_STRUCTURE = SCHEME.mock.schema;

//GET MOCKS FROM ONLINE DATABANK
export const getMocksDownload = (subjectID) => (dispatch, getState) => {
  let paths = `${path}/mock/cat/${subjectID}`;
  dispatch({ type: MOCK_LOADING });
  axios.get(paths, config(getState))
      .then(res => {
          res.data && Array.isArray(res.data) && parseInt(res.data.length) > 0 ? dispatch({type: MOCK_GET_MULTIPLE, payload: res.data}): dispatch({ type : MOCK_LOADING_ERROR, msg : 'No file'});
      })
      .catch(err => {dispatch({type : MOCK_DOWNLOADING_SUCCESS, msg : err })
      })
};

//GET ALL MOCK 
export const getMocksD = (subject) => (dispatch) => {
  let PARAM = {subjectID : subject};
  dispatch({ type: MOCK_LOADING });
  db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
    data && Array.isArray(data._array) && parseInt(data.length) > 0 ? dispatch({type: MOCK_GET_MULTIPLE, payload: data._array}): dispatch({ type : MOCK_LOADING_ERROR, msg : 'No file'});
  })
};

//SELECT SINGLE MOCK FROM MOCKS
export const getMock = (id) => (dispatch) => {
  dispatch({ type: MOCK_GET_ONE, payload: id})
};

//SELECT SINGLE MOCK FROM MOCKS
export const getMockSelected = (ids) => (dispatch) => {
  dispatch({ type: MOCK_GET_SELECTED, payload: ids})
};



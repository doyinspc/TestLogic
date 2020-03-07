import {
    RESOURCE_GET_MULTIPLE,
    RESOURCE_GET_ONE, 
    RESOURCE_LOADING,
    RESOURCE_LOADING_ERROR,
    RESOURCE_DOWNLOADING,
    RESOURCE_DOWNLOADING_SUCCESS,
    RESOURCE_DOWNLOADING_FAIL,
    RESOURCE_GET_SELECTED
} from "../types/Resource";

import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.resource.name;
const TABLE_STRUCTURE = SCHEME.resource.schema;

//GET RESOURCES FROM ONLINE DATABANK
export const getResourcesDownload = (topicID) => (dispatch, getState) => {
  let paths = `${path}/resource/cat/${topicID}`;
  dispatch({ type: RESOURCE_LOADING });
  axios.get(paths, config(getState))
      .then(res => {
          res.data && Array.isArray(res.data) && parseInt(res.data.length) > 0 ? dispatch({type: RESOURCE_GET_MULTIPLE, payload: res.data}): dispatch({ type : RESOURCE_LOADING_ERROR, msg : 'No file'});
      })
      .catch(err => {dispatch({type : RESOURCE_DOWNLOADING_SUCCESS, msg : err })
      })
};

//GET ALL RESOURCE 
export const getResourcesD = (topic) => (dispatch) => {
  let PARAM = {topicID : topic};
  dispatch({ type: RESOURCE_LOADING });
  db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
    data && Array.isArray(data._array) && parseInt(data.length) > 0 ? dispatch({type: RESOURCE_GET_MULTIPLE, payload: data._array}): dispatch({ type : RESOURCE_LOADING_ERROR, msg : 'No file'});
  })
};

//SELECT SINGLE RESOURCE FROM RESOURCES
export const getResource = (id) => (dispatch) => {
  dispatch({ type: RESOURCE_GET_ONE, payload: id})
};

//SELECT SINGLE RESOURCE FROM RESOURCES
export const getResourceSelected = (ids) => (dispatch) => {
  dispatch({ type: RESOURCE_GET_SELECTED, payload: ids})
};



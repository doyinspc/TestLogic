import {
    THEME_GET_MULTIPLE,
    THEME_GET_ONE, 
    THEME_LOADING,
    THEME_LOADING_ERROR,
    THEME_GET_MULTIPLE_ONLINE,
    THEME_LOADING_ERROR_ONLINE,
    THEME_LOADING_ONLINE,
    THEME_GET_SELECTED
} from "../types/Theme";

import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;

const TABLE_NAME = SCHEME.theme.name;
const TABLE_STRUCTURE = SCHEME.theme.schema;

//GET THEMES FROM ONLINE DATABANK
export const getThemesCloud = (subjectID) => (dispatch, getState) => {
  let paths = `${path}/theme/mult/n`;
  dispatch({ type: THEME_LOADING_ONLINE });
  axios.patch(paths, subjectID, config(getState))
      .then(res => {
          loadData(res.data, 'theme', ()=>{
          res.data ? dispatch({type: THEME_GET_MULTIPLE_ONLINE, payload: res.data }) : dispatch({type : THEME_LOADING_ERROR_ONLINE,  msg : 'Not Sac' }) ;
        });
      })
      .catch(err => {dispatch({type : THEME_LOADING_ERROR_ONLINE, msg : err })
      })
};

//GET ALL THEME 
export const getThemes = (subject) => (dispatch) => {
  let PARAM = {subjectID : subject};
  dispatch({ type: THEME_LOADING });
  db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
    data && Array.isArray(data._array) && parseInt(data._length) > 0 ? dispatch({type: THEME_GET_MULTIPLE, payload: data._array}): dispatch({ type : THEME_LOADING_ERROR, msg : 'No file'});
  })
};

//SELECT SINGLE THEME FROM THEMES
export const getTheme = (id) => (dispatch) => {
  dispatch({ type: THEME_GET_ONE, payload: id})
};

//KEEP SELECTED THEMES
export const getThemesSelected = (ids) => (dispatch) => {
  dispatch({ type: THEME_GET_SELECTED, payload: ids})
};

loadData  = (data, tables, callback) =>{
  const TABLES_NAME = SCHEME[tables].name;
  const TABLES_STRUCTURE = SCHEME[tables].schema;
  db.initDB(TABLES_NAME, TABLES_STRUCTURE);
  let dt  = [];
    data.forEach(element => {
      db.insert(TABLES_NAME, TABLES_STRUCTURE, element, (data)=>{
        if(data == 'xx')
        {
          // failed to insert
        }
        else if(data > 0)
        {
          dt.push(data);
        }
      })
   });
   callback(dt);
};


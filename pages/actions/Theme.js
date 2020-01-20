import {
    THEME_GET_MULTIPLE,
    THEME_GET_ONE, 
    THEME_LOADING,
    THEME_LOADING_ERROR,
    THEME_DOWNLOADING,
    THEME_DOWNLOADING_SUCCESS,
    THEME_DOWNLOADING_FAIL,
    THEME_GET_SELECTED
} from "../types/Theme";

import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.theme.name;
const TABLE_STRUCTURE = SCHEME.theme.schema;

//GET THEMES FROM ONLINE DATABANK
export  const getThemesDownload = (subjectID) => (dispatch, getState) => {
  let paths = `${path}/theme/cat/${subjectID}`;
  dispatch({ type: THEME_DOWNLOADING });
  axios.get(paths, config(getState))
      .then(async res => {
            await loadData(res.data, 'theme', async (d)=>{
            res.data  ? await dispatch({type: THEME_DOWNLOADING_SUCCESS, payload: res.data }) : await dispatch({type : THEME_DOWNLOADING_FAIL,  msg : 'Not Saved' }) ;
        });
      })
      .catch(err => {dispatch({type : THEME_DOWNLOADING_SUCCESS, msg : err })
      })
};

//GET ALL THEME 
export const getThemes = (subject) => (dispatch) => {
  let PARAM = {subjectID : subject};
  dispatch({ type: THEME_LOADING });
  db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, async (data)=>{
    data._array && Array.isArray(data._array) && parseInt(data.length) > 0 ? await dispatch({type: THEME_GET_MULTIPLE, payload: data._array}): dispatch({ type : THEME_LOADING_ERROR, msg : 'No file'});
  })
};

//SELECT SINGLE THEME FROM THEMES
export const getTheme = (id) => (dispatch) => {
  dispatch({ type: THEME_GET_ONE, payload: id})
};

//SELECT SINGLE THEME FROM THEMES
export const getThemeSelected = (ids) => (dispatch) => {
  dispatch({ type: THEME_GET_SELECTED, payload: ids})
};



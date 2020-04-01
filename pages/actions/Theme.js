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
export const getThemesDownload = (subjectID) => (dispatch, getState) => {
  return new Promise((resolve, reject) =>{
    dispatch({ type: THEME_DOWNLOADING });
    if(subjectID && parseInt(subjecID) > 0)
    {
      //let paths = `${path}/theme/cat/${subjectID}`;
      let paths = `${path}/api/`;
      let params = {
        data:{subjectID},
        cat:'all',
        table:TABLE_NAME,
        token:config
      }
      axios.get(paths, {params})
          .then(async res => {
            await loadData(res.data, 'theme', async (d)=>{
              if(res.data && Array.isArray(res.data) && res.data.length > 0 )
              {
                await dispatch({type: THEME_DOWNLOADING_SUCCESS, payload: res.data });
                resolve(res.data.length);
              }else
              {
                await dispatch({type : THEME_DOWNLOADING_FAIL,  msg : 'Not Saved' }) ;
                reject('Not Saved')
              } 
            });
          })
          .catch(err => {
            dispatch({type : THEME_DOWNLOADING_FAIL, msg : err })
            reject(err);
          })
        }else
        {
            reject('No Theme(s) Offline');
        }
    })
};

//GET ALL THEME 
export const getThemes = (subject) => (dispatch) => {
  return new Promise((resolve, reject) =>{
    let PARAM = {subjectID : subject};
    if(subject && parseInt(subject) > 0)
    {
      dispatch({ type: THEME_LOADING });
      db.selectPromise(TABLE_NAME, PARAM)
        .then(data =>{
          if(data._array && Array.isArray(data._array) && parseInt(data.length) > 0 )
          {
            dispatch({type: THEME_GET_MULTIPLE, payload: data._array})
            resolve(data._array.length);
          }else
          {
            dispatch({ type : THEME_LOADING_ERROR, msg : 'No Theme(s) Offline'});
            reject('No Theme(s) Offline')
          }
        })
        .catch(err=>reject(err))
    }else
    {
        reject('No Theme(s) Offline');
    }
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



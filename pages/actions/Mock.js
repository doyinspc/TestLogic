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
  //let paths = `${path}/mock/cat/${subjectID}`;
  let paths = `${path}/api/`;
  let params = {
    data:{subjectID},
    cat:'all',
    table:TABLE_NAME,
    token:token
  }
  dispatch({ type: MOCK_LOADING });
  axios.get(paths, {params})
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

export const loaddata =  (data, tables, callback) =>{
  // data : rows from cloud
  // tables : database table to be used
  // get the columns of a table that can be edite
  const editable_rows = SCHEME[tables].edits;
  // crea an array to store return valuse 
  let dt  = [];
  //check if data is available
  // run through the array
  data && Array.isArray(data) && data.length > 0 ? data.forEach(async data_row => {
      //pick a row via id confirm id is not zero
      if(data_row.id && parseInt(data_row.id) > 0)
      {
        //ARG - ROW id , table name
        // select row from sqlite db usign id and table name
        await selectPut(data_row.id, tables, (sqlite_row)=>{
            //COMPARE THE DATA ROW AND THE SQLITE ROW DATA
            compare(sqlite_row, data_row, editable_rows, (col)=>{
              console.log(`Comparing ${tables} ${data_row.id} `);
              if(col[0] === 0)
              {
                dt.push(data_row.id);
                loadUpdate(col[1], tables, data_row.id,  (da)=>{dt.push(data_row.id); console.log(`Updating ${tables} ${data_row.id}`);})
              }else if(col[0] === 1)
              {
                loadInsert(data_row, tables, (da)=>{dt.push(da); console.log(`Inserting ${tables} ${data_row.id}`);})
              }
            else if(col[0] === 2)
            {
              console.log(`Exist ${tables} row ${data_row.id} no changes required`);
              //callback(dt)
            }
            })
      })
    }
      
   })
   : null ;
   callback(dt); 
};


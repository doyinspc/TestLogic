import Database from './../api/Database';
import  SCHEME  from './../api/Schema';
import config from './../../config';

// export const DB_PATH = new Database();
// export const API_PATH = 'http://192.168.43.193:3001';
// export const CLIENT_PATH = 'http://192.168.43.193:3001';
// export const IMAGE_PATH = 'http://192.168.43.193:3001';
// export const GOOGLE_API_KEY = 'AIzaSyCxF6kwjt3VAxyLJbCH9_V2H52dSWQI_Cw';
// export const GOOGLE_PATH = '159610177254-5euec0rreq4qhhuekm83tbe8tfcrqjsj.apps.googleusercontent.com';
// export const FACEBOOK_PATH = 537525200303016;
// export const ADMOB = 'ca-app-pub-5431380497963954/5927443820';
// export const ADINTER = 'ca-app-pub-5431380497963954/4867333973';
// export const ADREWARD = 'ca-app-pub-5431380497963954/4867333973';
// export const PUBLISHER = 'http://192.168.43.193:3001';
// export const EMU = 'EMULATOR';;

export const DB_PATH = new Database();
export const API_PATH = config.API_PATHS;
export const CLIENT_PATH = config.CLIENT_PATH;
export const IMAGE_PATH = config.IMAGE_PATH;
export const GOOGLE_API_KEY = config.GOOGLE_API_KEY;
export const GOOGLE_PATH = config.GOOGLE_PATH;
export const FACEBOOK_PATH = config.FACEBOOK_PATH;
export const ADMOB = config.ADMOB;
export const ADINTER = config.ADINTER;
export const ADREWARD = config.ADREWARD;
export const PUBLISHER = config.PUBLISHER;
export const EMU = config.EMU;

const db = DB_PATH;

export const CONFIG =(GETSTATE)=>{
    // headers
    const config ={
        headers:{
            
        }
    }
}

export const LOADDATAS  = (data, tables, callback) =>{
    const TABLES_NAME = SCHEME[tables].name;
    const TABLES_STRUCTURE = SCHEME[tables].schema;
    let dt  = [];
      data.forEach(element => {
        db.insert(TABLES_NAME, TABLES_STRUCTURE, element, async (data)=>{
          if(data == 'xx')
          {
            // failed to insert
          }
          else if(data > 0)
          {
            console.log(`${TABLES_NAME} DONE ${data}`)
            await dt.push(data);
          }
        }
        )
     });
     callback(dt);
  };

  export const LOADDATA  =  (data, tables, callback) =>{
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
  
  export const DROPDATA  = (tables) =>{
    const TABLES_NAME = SCHEME[tables].name;
    const TABLES_STRUCTURE = SCHEME[tables].schema;
    return new Promise((resolve) => {
      db.drop(TABLES_NAME, TABLES_STRUCTURE, (data)=>{
          console.log(`Table Droped : ${TABLES_NAME}`);
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


  const loadInsert  = async (data, tables, callback) => {
    const TABLES_NAME = SCHEME[tables].name;
    const TABLES_STRUCTURE = SCHEME[tables].schema;
        await db.insert(TABLES_NAME, TABLES_STRUCTURE, data, (d)=>{
          if(d == 'xx')
          {
            // failed to insert
          }
          else if(d > 0)
          {
            callback(d);
          }
        })
  };

  const loadUpdate  = async (data, id, tables, callback) => {
    const TABLES_NAME = SCHEME[tables].name;
    const TABLES_STRUCTURE = SCHEME[tables].schema;
        await db.update(TABLES_NAME, TABLES_STRUCTURE, data, id, (d)=>{
          if(d == 'xx')
          {
            // failed to insert
          }
          else if(d > 0)
          {
            callback(d);
          }
        })
  };

  const selectPut  = async (id, tables, callback) => {
    const TABLES_NAME = SCHEME[tables].name;
    const TABLES_STRUCTURE = SCHEME[tables].schema;
    const PARAM = {id:id};
        await db.select(TABLES_NAME, TABLES_STRUCTURE, PARAM,  (d)=>{
          if(d)
          {
            //get single row
            callback(d._array[0]);
          }
        })
  };

  const compare  = async(sqldb, insertdb, editable, callback) => {
        if(sqldb)
        {
          //if row exist in database
          let correctedRow = {};
          Object.keys(editable).forEach((key, index)=> {
            // key: the name of the object key
            // if approve item in data is not the same as that in DB
            // store the key and the new data in array correctedRow else ignore
            if(insertdb[key] && sqldb[key] && sqldb[key] !== insertdb[key] && insertdb[key] !== undefined)
            {
              correctedRow[key] = insertdb[key];
            }
          });
          //if any row is corrected return 0 so as to be updated
            if(Object.keys(correctedRow).length > 0)
            {
                callback([0, correctedRow]);
            }else
            {
                callback([2, insertdb]);
            }
        }else
        {
          //if row does not exist in db
          //return 1 : row to be inserted
          callback([1, insertdb]);
        }
       
  };
  
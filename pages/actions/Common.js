import Database from './../api/Database';
import  SCHEME  from './../api/Schema';

export const DB_PATH = new Database();
export const API_PATH = 'http://192.168.43.193:3001';
export const CLIENT_PATH = 'http://192.168.43.193:3001';
export const IMAGE_PATH = 'http://192.168.43.193:3001';
export const GOOGLE_PATH = '159610177254-5euec0rreq4qhhuekm83tbe8tfcrqjsj.apps.googleusercontent.com';
export const FACEBOOK_PATH = 537525200303016;
export const ADMOB = 'ca-app-pub-5431380497963954/5927443820';
export const ADINTER = 'ca-app-pub-5431380497963954/4867333973';
export const ADREWARD = 'ca-app-pub-5431380497963954/4867333973';
export const PUBLISHER = 'http://192.168.43.193:3001';
export const EMU = 'EMULATOR';;

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
     console.log(dt);
  };

  export const LOADDATA  = (data, tables) =>{
    const TABLES_NAME = SCHEME[tables].name;
    const TABLES_STRUCTURE = SCHEME[tables].schema;
    const TABLES_EDITS = SCHEME[tables].edits;
    let dt  = [];
      data.forEach(element => {
        if(element.id && parseInt(element.id) > 0){
        selectInsert(element.id, tables, (dat)=>{
          compare(dat, element, TABLES_EDITS, (col)=>{
            if(col[0] === 0)
            {
              loadUpdate(col[1], tables, element.id,  (da)=>{})
            }else
            {
              loadInsert(element, tables, (da)=>{})
            }
          })
        })
      }
        
     });
      return dt;
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

  const selectInsert  = async (id, tables, callback) => {
    const TABLES_NAME = SCHEME[tables].name;
    const TABLES_STRUCTURE = SCHEME[tables].schema;
    const PARAM = {id:id};
        await db.select(TABLES_NAME, TABLES_STRUCTURE, PARAM,  (d)=>{
          if(d)
          {
            callback(d._array[0]);
          }
        })
  };
  const compare  = async(sqldb, insertdb, editable, callback) => {
        if(sqldb)
        {
          let correctedRow = {};
         editable.forEach((row) =>{
            if(insertdb[row] && sqldb[row] !== insertdb[row] && insertdb[row] !== undefined)
            {
              correctedRow[row] = insertdb[row];
            }
         })
         if(Object.keys(correctedRow).length > 0){
          callback([2, correctedRow]);
         }
          
        }else{
          callback([1, insertdb])
        }
       
  };
  
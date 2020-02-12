import Database from './../api/Database';
import  SCHEME  from './../api/Schema';

export const DB_PATH = new Database();
export const API_PATH = 'http://192.168.43.193:3001';
export const CLIENT_PATH = 'http://192.168.43.193:3001';
export const IMAGE_PATH = 'http://192.168.43.193:3001';
export const GOOGLE_PATH = '159610177254-5euec0rreq4qhhuekm83tbe8tfcrqjsj.apps.googleusercontent.com';
export const FACEBOOK_PATH = 537525200303016;
//export const API_PATH = 'http://192.168.0.102:3001'; 
//export const API_PATH = 'http://192.168.42.35:3001';

const db = DB_PATH;

export const CONFIG =(GETSTATE)=>{
    // headers
    const config ={
        headers:{
            
        }
    }
}

export const LOADDATA  = (data, tables, callback) =>{
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
        })
     });
     callback(dt);
     console.log(dt);
  };

  export const LOADDATAS  = (data, tables) =>{
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
        })
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
  
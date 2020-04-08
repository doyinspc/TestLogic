import Database from './../api/Database';
import SCHEME  from './../api/Schema';
import config from './../../config';
import { AsyncStorage } from 'react-native';
import { createStore } from 'redux';
import reducer from './../reducers/index';

const sto = createStore(reducer);
let st = sto.getState().userReducer;
console.log(st);
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
//export const API_PATH = st.path_main;
export const API_PATH = config.API_PATHS;
export const CLIENT_PATH = config.CLIENT_PATH;
//export const IMAGE_PATH = st.path_image;
export const IMAGE_PATH = config.IMAGE_PATH;
export const GOOGLE_API_KEY = config.GOOGLE_API_KEY;
export const GOOGLE_PATH = config.GOOGLE_PATH;
export const FACEBOOK_PATH = config.FACEBOOK_PATH;
export const ADMOB = config.ADMOB;
export const ADINTER = config.ADINTER;
export const ADREWARD = config.ADREWARD;
export const PUBLISHER = config.PUBLISHER;
export const EMAIL = st['uniqueid'];
export const EMU = config.EMU;

const db = DB_PATH;


const _retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
     return value;
  } catch (error) {
    // Error retrieving data
  }
};

console.log(_retrieveData('user'));
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

  export const LOADDATA =   (data, tables, editable_rows) =>{
    // creaTE an array to store return value 
 return new Promise((resolve, reject)=>{
   if(data && Array.isArray(data) && data.length > 0 )
   {
       let dx = data.map(data_row => (
       LoadDataSinglePromise(tables, data_row, editable_rows)
       .then(async (res)=>{
           await resolve(res);
       })
       .catch(async (err)=>{
          await  reject(err);
       })
     ))
      resolve(dx);
 }else{reject(`No Data Provided ${tables} ${JSON.stringify(data)} ${Object.keys(data).length}`) ;}
})
};

const LoadDataSinglePromise = (tables, data_row, editable_rows) =>{

 return new Promise((resolve, reject)=>{
   //pick a row via id confirm id is not zero
   if(data_row.id && parseInt(data_row.id) > 0)
   {
     //ARG - ROW id , table name
     //select row from sqlite db usign id and table name
     selectPutPromise(tables, data_row.id)
     .then(async sqlite_row=>{
         //IF ROW IN AVAILABLE IN DB
         //COMPARE THE DATA ROW AND THE SQLITE ROW DATA
         //AND UPDATE
         await comparePromise(sqlite_row, data_row, editable_rows)
         .then(async rep =>{
              if(rep[0] === 0){
                 await loadUpdatePromise(rep[1], data_row.id, tables)
                 .then(async da=>{
                   console.log(`Updated ${tables} ${data_row.id}`);
                   resolve(data_row.id);
                 })
                 .catch(async err=>{
                   console.log(`Update failed ${tables} ${data_row.id} ${err}`);
                   resolve(data_row.id);
                 })
             }
             else if(rep[0] === 1){
                 await loadInsertPromise(tables, data_row)
                 .then(async res=>{ 
                   console.log(`Inserting ${JSON.stringify(res)} ${tables} ${data_row.id}`);
                   await resolve(res);
                 })
                 .catch(async err =>{
                   //DATA FAIL TO INSERT
                   //SHOW ERROR
                   //COUNT INSERT FAILS
                   await resolve('no update was required');
                 })
           }
           else if(rep[0] === 2){
               //BOTH ROWS ARE EQUAL NO INSERT OR UPDATE REQUIRED;
               resolve(data_row.id)
           }
         })
         .catch(err =>{
           //BOTH DATA WERE AVAILABLE BUT COULD NOT COMPARE
           reject(`trrr${JSON.stringify(err)}`)
           console.log(`trrr${JSON.stringify(err)}`);
         })
     })
     .catch(async error=>{
         //IF ROW IS NOT AVAILABLE IN OFFLINE DB
         //INSERT ROW INTO OFFLINE DB
         await loadInsertPromise(tables, data_row)
         .then(async res=>{
           //DATA WAS INSERTED SUCCESFULLY
           //GET INSERT ID
           console.log(`Inserting ${JSON.stringify(res)} ${tables} ${data_row.id}`);
           await resolve(res)
         })
         .catch(async err=>{
           //DATA FAIL TO INSERT
           //SHOW ERROR
           //COUNT INSERT FAILS
           await console.log(err);
           await resolve(1);
         })
     })
   }
 })
}

const selectPutPromise  = (tables, id) => {
 const TABLES_NAME = tables;
 const PARAM = {id:id};
 return new Promise((resolve, reject)=>{
   db.selectPromise(TABLES_NAME, PARAM)
   .then(async arr=>{
    await  arr && Array.isArray(arr._array) && arr._array.length > 0 ? resolve(arr._array[0]) : reject(`${tables} id ${id} not found in offline DB`);
   })
   .catch(error=>{console.log(error); reject(`${tables} id ${id} not found in offline DB`) })    
 })
};

const loadInsertPromise  = (tables, data) => {
 const TABLES_NAME = tables;
 return new Promise((resolve, reject)=>{
   db.insertPromise(TABLES_NAME, data)
   .then(async id=>{
       await id && id > 0 ? resolve(id): reject(`REJECT insert ${id}`);
     })
   .catch(err=>reject(err))
 })
};

const loadUpdatePromise  = (data, id, tables) => {
 const TABLES_NAME = tables;
 return new Promise((resolve, reject)=>{
   db.updatePromise(TABLES_NAME, data, id)
   .then(async uid=>{
       await uid && uid > 0 ? resolve(uid): reject(`REJECT update ${uid}`);
     })
   .catch(err=>reject(err))
 })
};

const comparePromise  = (sqldb, insertdb, editable) => {
 return new Promise((resolve, reject)=>{
   if(sqldb && Object.keys(sqldb).length > 0 && sqldb !== undefined)
   {
     //if row exist in database
     let correctedRow = {};
     Object.values(editable).forEach((key)=> {
       // key: the name of the object key
       // if approve item in data is not the same as that in DB
       // store the key and the new data in array correctedRow else ignore
       if(insertdb[key] && sqldb[key] && sqldb[key] !== insertdb[key] && insertdb[key] !== undefined)
       {
         correctedRow[key] = insertdb[key];
       }
     });
     //if any row is corrected return 0 so as to be updatedconsole.log(key);
     let ar = [0, correctedRow];
     let arx = [2, insertdb];
     let ret = correctedRow && Object.keys(correctedRow).length > 0 ? ar : arx ;
     //return ret;
     resolve(ret);
   }
   else
   {
     //IF ROW DOES NOT EXIST
     //RETURN 1 : ROW BE INSERTED
     //return [2, insertdb];
     reject([2, insertdb]);
   }
 })
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


  const loadInsert  = (data, tables) => {
    const TABLES_NAME = SCHEME[tables].name;
    return new Promise((resolve, reject)=>{
        db.insertPromise(TABLES_NAME, data)
        .then((d)=>{
            resolve(d);
        })
        .catch(err=>{
          reject(err);
        })
      })
  };

  const loadUpdate  = (data, id, tables) => {
    return new Promise((resolve, reject)=>{
    const TABLES_NAME = SCHEME[tables].name;
        db.updatePromise(TABLES_NAME,  data, id)
        .then((d)=>{
            resolve(d);
        })
        .catch(err=>{
            reject(err);
        })
      })
  };

  const selectPut  = (id, tables) => {
    const TABLES_NAME = SCHEME[tables].name;
    const PARAM = {id:id};
      db.selectPromise(TABLES_NAME, PARAM)
        .then((d)=>{
            resolve(d._array[0]);
        })
        .catch(err=>{
            reject(err);
        })
  };

  const compare  = (sqldb, insertdb, editable) => {
    return new Promise((resolve, reject)=>{
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
                resolve([0, correctedRow]);
            }else
            {
                resolve([2, insertdb]);
            }
        }else
        {
          //if row does not exist in db
          //return 1 : row to be inserted
          resolve([1, insertdb]);
        }
      })  
  };
  
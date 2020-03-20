import {
  TOPIC_GET_MULTIPLE,
  TOPIC_GET_SELECTED,
  TOPIC_EDIT_SUCCESS, 
  TOPIC_GET_ONE, 
  TOPIC_LOADING,
  TOPIC_LOADING_ERROR,
  TOPIC_DOWNLOADING,
  TOPIC_DOWNLOADING_SUCCESS,
  TOPIC_DOWNLOADING_FAIL,
  TOPIC_DOWNLOADING_START,
  TOPIC_DOWNLOADING_STATE,
  TOPIC_UPDATING_STATE,
} from "../types/Topic";

import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;
//const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.topic.name;
const TABLE_STRUCTURE = SCHEME.topic.schema;

//GET TOPICS FROM ONLINE DATABANK
export const getTopicsDownload = (themeID) => (dispatch, getState) => {
  //START DOWNLOAD
  console.log(`activating ${themeID}`)
  dispatch({ type: TOPIC_DOWNLOADING, payload: 1});
  
  let topicID =  [];
  let instructionID =  [];
  let questionID =  [];

  let topic_paths = `${path}/topic/mult/n`;
  let instruction_paths = `${path}/instruction/mult/n`;
  let question_paths = `${path}/question/mult/n`;
  let answer_paths = `${path}/answer/mult/n`;
  let distractor_paths = `${path}/distractor/mult/n`;

  let theme_id_string = '';
  let topic_id_string = '';
  let instruction_id_string = '';
  let question_id_string = '';

  theme_id_string = themeID && Array.isArray(themeID) ? themeID.toString() : '';
        //START DOWNLOADING TOPICS
        axios.patch(topic_paths, {themeID:theme_id_string}, config(getState)).then(top => {
        dispatch({ type: TOPIC_DOWNLOADING, payload: 2});
        dispatch({ type: TOPIC_DOWNLOADING_SUCCESS, payload:top.data, id:themeID});
        //START SAVING TOPICS
        loadData(top.data, 'topic', (ex) =>{
            let topics = top.data;
            topics.map((row) =>(topicID.push(row.id)));
            topic_id_string = topicID && Array.isArray(topicID) ? topicID.join(',') : '';
            //START DOWNLOADING INSTRUCIONS
            axios.patch(instruction_paths, {topicID:topic_id_string}, config(getState)).then(async inst => {
                //START SAVING INSTRUCTION
                loadData(inst.data, 'instruction', (ex1) =>{
                  let instructions = inst.data;
                    instructions.map((row) =>(instructionID.push(row.id)));
                    instruction_id_string = instructionID && Array.isArray(instructionID) ? instructionID.toString() : '';
                    //START DOWNLOADING QUESTIONS
                    axios.patch(question_paths, {instructionID:instruction_id_string}, config(getState)).then(async ques => {
                      //if(ques.data && Array.isArray(ques.data) && ques.data.length > 0 ){}
                      //TOTAL QUESTIONS DOWNLOADED FOR THE TOPIC
                      question_number = ques.data.length;
                      console.log(`${ question_number} available to load`)
                      //DISPATCH TOTAL NUMBER FOR THAT TOPIC
                      dispatch({ type:TOPIC_DOWNLOADING_START, topicid:topic_id_string, topicquestions:question_number});
                      //INITIAE COUNTER
                      let questioncount = 0;
                      //LOOP THROUGH QUESTIONS AND SAVE
                      ques.data.forEach((row_ques)=>{
                      //START SAVE QUESTION
                        loadData(row_ques, 'question', (ex2)=>{
                          question_id_string = row_ques.id  ? row_ques.id.toString() : '';
                          //START DOWNLOADING ANSWERS
                          axios.patch(answer_paths, {questionID :question_id_string}, config(getState))
                          .then(async ques => {
                            //SAVE ANSWERS
                            loadData(ques.data, 'answer');
                          }).catch(err => console.log(err))
                          //END DOWNLOADING ANSWERS
                          //START DOWNLOADING DISTRACTORS
                          axios.patch(distractor_paths, {questionID :question_id_string}, config(getState))
                          .then(async ques => {
                            //SAVE DISTRACTORS
                            loadData(ques.data, 'distractor');
                          }).catch(err => console.log(err))
                          //END DOWNLOADING DISTRACTORS
                       });
                        //END SAVE QUESTION
                        //PROGRESS BAR INCREASED
                        questioncount = questioncount + 1;
                        console.log(`${ questioncount} saved`)
                        dispatch({ type: TOPIC_DOWNLOADING_STATE, topicid:topic_id_string, topicquestions:question_number});
                      });
                      //LOOP THROUGH QUESTIONS AND SAVE
                      }).catch(err => console.log(err))
                    //END DOWNLOADING QUESTION
                    });
                    //END SAVING INSTRUCTIONS
            }).catch(err => console.log(err))
                //END DOWNLOADING INSTRUCTION
            });
            //END SAVING TOPICS
        }).catch(err => console.log(err))
        //END DOWNLOADING TOPICS
}

//GET TOPICS FROM ONLINE DATABANK
export const getTopicsDownloadOnly = (topi) => (dispatch, getState) => {
  //START DOWNLOAD
  console.log(`activating ${topi}`)
  dispatch({ type: TOPIC_DOWNLOADING, payload: 1});
  let instruction_paths = `${path}/instruction/cat/${topi}`;
            //START DOWNLOADING INSTRUCIONS
            axios.get(instruction_paths, config(getState))
            .then(inst => {
                //START SAVING 
                //CHECK IF INSTRUCTION IS AVAILABLE
                inst && inst.data && Array.isArray(inst.data) && inst.data.length > 0 ? 
                loadDataPromise(inst.data, SCHEME['instruction'].name, SCHEME['instruction'].edits)
                .then( rep =>{
                    let instructionID = [];
                    let instructions = inst.data;
                    instructions.map((row) =>(instructionID.push(row.id)));
                    let instruction_id_string = instructionID && Array.isArray(instructionID) ? instructionID.toString() : '';
                    //START DOWNLOADING QUESTIONS
                    let question_paths = `${path}/question/mult/n`;
                    axios.patch(question_paths, {instructionID:instruction_id_string}, config(getState))
                    .then(ques => {
                      //TOTAL QUESTIONS DOWNLOADED FOR THE TOPIC
                      //DISPATCH TOTAL NUMBER FOR THAT TOPIC
                      let question_number = ques.data.length;
                      console.log(`${ question_number} available to load`);
                      dispatch({ type:TOPIC_DOWNLOADING_START, topicid:topi, topicquestions:question_number});
                      let questioncount = 0;
                      let times = 0;
                      //LOOP THROUGH QUESTIONS AND SAVE
                      ques.data.forEach(row_ques =>{
                      //START SAVE QUESTION
                      let q_arr = [row_ques];
                        loadDataPromise(q_arr, SCHEME['question'].name, SCHEME['question'].edits)
                        .then(async rep =>{
                          console.log(`NUMBER LOOPING  ${JSON.stringify(rep.id)}`)
                          //START DOWNLOADING ANSWERS
                          let answer_paths = `${path}/answer/cat/${row_ques.id}`;
                          let distractor_paths = `${path}/distractor/cat/${row_ques.id}`;
                          axios.get(answer_paths, config(getState))
                          .then(async an => {
                            console.log(JSON.stringify(an.data))
                            //SAVE ANSWERS
                            await loadDataPromise(an.data, SCHEME['answer'].name, SCHEME['answer'].edits)
                            .then(async r =>{
                              //ANSWER UPLOAD SUCCESS
                              //START DOWNLOADING DISTRACTORS
                              await axios.get(distractor_paths, config(getState))
                              .then(async di => {
                                //SAVE DISTRACTORS
                                await loadDataPromise(di.data, SCHEME['distractor'].name, SCHEME['distractor'].edits)
                                .then(async r_d=>{
                                  questioncount = await questioncount + 1;
                                  await console.log(`${ questioncount} saved`);
                                  await dispatch({ type: TOPIC_DOWNLOADING_STATE, topicid:topi, tquestions:questioncount});
                                })
                                .catch(async e_d=>{
                                  questioncount = await questioncount + 1;
                                  await console.log(`${ questioncount} saved`);
                                  await dispatch({ type: TOPIC_DOWNLOADING_STATE, topicid:topi, tquestions:questioncount});
                                })
                              }).catch(err => console.log(err))
                              //END DOWNLOADING DISTRACTORS
                            })
                            .catch(async e =>{
                              //ANSWER LOAD FAIL
                              questioncount = await questioncount + 1;
                              await console.log(`${ questioncount} saved`);
                              await dispatch({ type: TOPIC_DOWNLOADING_STATE, topicid:topi, tquestions:questioncount});
                            })
                          })
                          .catch(err => console.log(err))
                          //END DOWNLOADING ANSWERS  
                          questioncount = await questioncount + 1;
                          await console.log(`${ questioncount} saved`);
                          await dispatch({ type: TOPIC_DOWNLOADING_STATE, topicid:topi, tquestions:questioncount});  
                        })
                        //END SAVE QUESTION
                        //PROGRESS BAR INCREASED
                        
                      });
                      //LOOP THROUGH QUESTIONS AND SAVE
                      })
                      .catch(err => console.log(err))
                    //END DOWNLOADING QUESTION
                  }): console.log(`No data instrucion`);
                    //END SAVING INSTRUCTIONS
            })
            .catch(err => console.log(err))
            //END DOWNLOADING INSTRUCTION     
}

//GET TOPICS FROM ONLINE DATABANK
export const getTopicsDBs = (themeID) => (dispatch, getState) => {
  dispatch({ type: TOPIC_DOWNLOADING, payload: 1});
  let topic_paths = `${path}/topic/mult/n`;
  let theme_id_string = '';
  theme_id_string = themeID && Array.isArray(themeID) ? themeID.toString() : ' ';
  axios.patch(topic_paths, {themeID:theme_id_string}, config(getState)).then(top => {
        dispatch({ type: TOPIC_DOWNLOADING_SUCCESS, payload:top.data, id:themeID});
        loadData(top.data, 'topic', (d)=>{
              //load after loading
              console.log(`loading and saving topics ${JSON.stringify(d)}`)
        });
        }).catch(err =>console.log(err))
}
//GET TOPICS FROM ONLINE DATABANK
export const getTopicCount = (topicID) => (dispatch, getState) => {
  //SET PATH TO COUNT QUESTIONS AVAILABLE
  let topic_paths = `${path}/topic/count/${topicID}`;
  //FETCH QUESTION NUMBER
  axios.get(topic_paths, config(getState)).then(top => {
        
        let on_top = top && Array.isArray(top.data) && top.data.length > 0 ? top.data[0].id: 0;
        //IF NO QUESTION ONLINE: STATE THAT
        console.log(`tops ${on_top}`);
        //FETCH NO OF QUESTIONS OFFLINE DB
        db.selectCountQuestions(topicID, (data)=>{
          console.log(data);
          let off_top = data && Array.isArray(data._array) && data._array.length > 0 ? data._array[0].id : 0;
          console.log(`TOPSZ ${off_top}`);
          //IF THE QUESTIONS ARE EQUAL DO NOTHING
          on_top != 0 && on_top == off_top ? dispatch({ type: TOPIC_UPDATING_STATE, topicID:topicID, status:2}) : null ; 
          //IF ONLINE IS MORE THAN OFFLINE ASK FOR UPDATE
          on_top != 0 && on_top > off_top ? dispatch({ type: TOPIC_UPDATING_STATE, topicID:topicID, status:1}) : null ; 
        })
        }).catch(err =>console.log(err))
        
}


//GET ALL TOPIC
export const getTopics = (theme) => (dispatch) => {
  dispatch({ type: TOPIC_LOADING})
  theme && Array.isArray(theme) ? 
  theme.forEach(id => {
      let PARAM = {themeID : id};
      db.selectTopic(TABLE_NAME, TABLE_STRUCTURE, PARAM, id, (data)=>{
        
        data == 1 ? null : dispatch({ type: TOPIC_GET_MULTIPLE, payload: data._array, status:3}); 
      })
      dispatch({type: TOPIC_LOADING_ERROR, msg: 'No Data'})
    }): db.selectTopic(TABLE_NAME, TABLE_STRUCTURE, {themeID : theme}, theme, (data)=>{
      
      data == 1 ? null : dispatch({ type: TOPIC_GET_MULTIPLE, payload: data._array, status:3}); 
    })

};

//GET ALL TOPIC
export const getTopicsDB = (topics) => (dispatch) => {
  let PARAM = {id : topics};
  db.selectIN(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
    data == 1 ? dispatch({type: TOPIC_LOADING_ERROR, msg: 'No Data'}) : dispatch({ type: TOPIC_GET_MULTIPLE, payload: data._array}); 
  })

};

//GET ALL TOPIC
const getTopicsDB1 = (topics) => (dispatch) => {
  let PARAM = {id : topics};
  db.selectTopic(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
    data == 1 ? dispatch({type: TOPIC_LOADING_ERROR, msg: 'No Data'}) : dispatch({ type: TOPIC_GET_MULTIPLE, payload: data._array}); 
  })

};

//SELECT SINGLE THEME FROM TOPICS
export const getTopic = (id) => (dispatch) => {
  dispatch({ type: TOPIC_GET_ONE, payload: id})
};

//KEEP SELECTED TOPICS
export const getTopicSelected = (ids) => (dispatch) => {
  dispatch({ type: TOPIC_GET_SELECTED, payload: ids})
};

//GET SINGLE TOPIC
export const updateTopic = (PARAM, id, callback) =>(dispatch, getState) =>{
  db.update(TABLE_NAME, TABLE_STRUCTURE, PARAM, id, (data)=>{
    dispatch({
      type: TOPIC_EDIT_SUCCESS,
      data: PARAM,
      id: id
    })
    callback(id);
  })
};

export const loadDataPromise  =   (data, tables, editable_rows) =>{
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


export const loadData  =  (data, tables, callback) =>{
  // data : rows from cloud
  // tables : database table to be used
  
  // get the columns of a table that can be edite
  const editable_rows = SCHEME[tables].edits;
  // crea an array to store return valuse 
  let dt  = [];
  //check if data is available
  // run through the array
  console.log(`numbers offfff  ${tables} ${JSON.stringify(data)} ${Object.keys(data).length}`)
    data && Array.isArray(data) && data.length > 0 ? data.forEach(async data_row => {
      //pick a row via id confirm id is not zero
      if(data_row.id && parseInt(data_row.id) > 0)
      {
        //ARG - ROW id , table name
        // select row from sqlite db usign id and table name
        await selectPut(data_row.id, tables, (sqlite_row)=>{
            //COMPARE THE DATA ROW AND THE SQLITE ROW DATA
            compare(sqlite_row, data_row, editable_rows, async (col)=>{
              //console.log(`Comparing ${tables} ${data_row.id} ${col[0]} `);
              if(col[0] === 0)
              {
                await loadUpdate(col[1], tables, data_row.id, 
                  (da)=>{
                    callback(col[0]); 
                    console.log(`Updating ${tables} ${data_row.id}`);
                  })
              }else if(col[0] === 1)
              {
                console.log(`to insert`)
                await loadInsert(data_row, tables, (da)=>{ console.log(`Inserting ${JSON.stringify(da)} ${tables} ${data_row.id}`);})
              }
            else if(col[0] === 2)
            {
              //console.log(`Exist ${tables} row ${data_row.id} no changes required`);
            }
            })
      })
    }
    callback(1);
   })
   : null ;
   //callback(dt); 
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
        console.log(d)
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
  //console.log(`sql table${JSON.stringify(sqldb)}`)
  //console.log(`insert table${JSON.stringify(insertdb)}`)
  if(sqldb && sqldb !== undefined)
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

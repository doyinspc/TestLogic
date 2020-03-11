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
  TOPIC_DOWNLOADING_STATE
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
export const getTopicsDownloadOnly = (topi, callback) => (dispatch, getState) => {
  //START DOWNLOAD
  console.log(`activating ${topi}`)
  dispatch({ type: TOPIC_DOWNLOADING, payload: 1});
  
  let topicID =  [];
  let instructionID =  [];
  let questionID =  [];

  let instruction_paths = `${path}/instruction/cat/${topi}`;
  let question_paths = `${path}/question/mult/n`;
  let answer_paths = `${path}/answer/mult/n`;
  let distractor_paths = `${path}/distractor/mult/n`;

  let topic_id_string = '';
  let instruction_id_string = '';
  let question_id_string = '';


        //START DOWNLOADING TOPICS
            topic_id_string = topi;
            console.log(`next stage topics ${topic_id_string}`);
            //START DOWNLOADING INSTRUCIONS
            axios.get(instruction_paths,  config(getState))
            .then(async inst => { 
              console.log(JSON.stringify(inst.data))
                //START SAVING INSTRUCTION
                await loadData(inst.data, 'instruction', async (ex1) =>{
                  console.log(ex1)
                  let instructions = inst.data;
                    instructions.map((row) =>(instructionID.push(row.id)));
                    console.log(`next stage INSTRUCTION ${instructions}`)
                    instruction_id_string = instructionID && Array.isArray(instructionID) ? instructionID.toString() : '';
                    //START DOWNLOADING QUESTIONS
                    console.log(`next stage INSTRUCTION ${instruction_id_string}`)
                    axios.patch(question_paths, {instructionID:instruction_id_string}, config(getState))
                    .then(async ques => {
                      console.log(`next stage question ${topic_id_string}`);
                      //TOTAL QUESTIONS DOWNLOADED FOR THE TOPIC
                      let question_number = ques.data.length;
                      console.log(`${ question_number} available to load`);
                      console.log( ques.data );
                      //DISPATCH TOTAL NUMBER FOR THAT TOPIC
                      dispatch({ type:TOPIC_DOWNLOADING_START, topicid:topic_id_string, topicquestions:question_number});
                      //INITIAE COUNTER
                      let questioncount = 0;
                      let times = 0;
                      //LOOP THROUGH QUESTIONS AND SAVE
                      await ques.data.forEach( async (row_ques)=>{
                        console.log(`NUMBER LOOPING ${++times}`)
                      //START SAVE QUESTION
                        await loadData(row_ques, 'question', (ex2)=>{
                          question_id_string = row_ques.id  ? row_ques.id.toString() : '';
                          //START DOWNLOADING ANSWERS
                          axios.patch(answer_paths, {questionID :question_id_string}, config(getState))
                          .then(async ques => {
                            //SAVE ANSWERS
                            await loadData(ques.data, 'answer');
                          }).catch(err => console.log(err))
                          //END DOWNLOADING ANSWERS
                          //START DOWNLOADING DISTRACTORS
                          axios.patch(distractor_paths, {questionID :question_id_string}, config(getState))
                          .then(async ques => {
                            //SAVE DISTRACTORS
                            await loadData(ques.data, 'distractor');
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
                callback(parseInt(topic_id_string));
          
}

//GET TOPICS FROM ONLINE DATABANK
export const getTopicsDownloadOnlyx = (topi) => (dispatch, getState) => {
  console.log(`activating ${ topi }`);
  dispatch({ type: TOPIC_DOWNLOADING, payload: 1});
  
  let topicID =  [];
  let instructionID =  [];
  let questionID =  [];

  let topic_paths = `${path}/topic/${topi}`;
  let instruction_paths = `${path}/instruction/mult/n`;
  let question_paths = `${path}/question/mult/n`;
  let answer_paths = `${path}/answer/mult/n`;
  let distractor_paths = `${path}/distractor/mult/n`;

  let topic_id_string = '';
  let instruction_id_string = '';
  let question_id_string = '';
  axios.get(topic_paths, config(getState)).then(top => {
        dispatch({ type: TOPIC_DOWNLOADING, payload: 2});
        dispatch({ type: TOPIC_DOWNLOADING_SUCCESS, payload:top.data, id:topi});
        loadData(top.data, 'topic', (ex) =>{
          console.log(ex);
          let topics = top.data;
            topics.map((row) =>(topicID.push(row.id)));
            topic_id_string = topicID && Array.isArray(topicID) ? topicID.join(',') : '';
            console.log(topic_id_string);
            axios.patch(instruction_paths, {topicID:topic_id_string}, config(getState)).then( inst => {
                dispatch({ type: TOPIC_DOWNLOADING, payload: 3});
                 loadData(inst.data, 'instruction', (ex1) =>{
                  console.log(ex1);
                  let instructions = inst.data;
                    instructions.map((row) =>(instructionID.push(row.id)));
                    instruction_id_string = instructionID && Array.isArray(instructionID) ? instructionID.toString() : '';
                    
                    axios.patch(question_paths, {instructionID:instruction_id_string}, config(getState)).then( ques => {
                      dispatch({ type: TOPIC_DOWNLOADING, payload: 4});
                      loadData(ques.data, 'question', (ex2)=>{

                        let questions = ques.data;
                        questions.map((row) =>(questionID.push(row.id)));
                        question_id_string = questionID && Array.isArray(questionID) ? questionID.toString() : '';
                        
                        axios.patch(answer_paths, {questionID :question_id_string}, config(getState)).then( ques => {
                          dispatch({ type: TOPIC_DOWNLOADING, payload: 6});
                           loadData(ques.data, 'answer', (ex3)=>{
                            axios.patch(distractor_paths, {questionID :question_id_string}, config(getState)).then( ques => {
                              dispatch({ type: TOPIC_DOWNLOADING, payload: 7});
                               loadData(ques.data, 'distractor', ()=>{
                                //non
                                callback(1);
                              });
                              }).catch(err => {dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})
                           });
                          });
                          }).catch(err => {dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})

                      }).catch(err => {dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})

                    });
                
                }).catch(err => {dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})
            });
        
          }).catch(err => {console.log(err); dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})
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
        });
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

export const loadData  =  (data, tables, callback) =>{
  // data : rows from cloud
  // tables : database table to be used
  
  // get the columns of a table that can be edite
  const editable_rows = SCHEME[tables].edits;
  // crea an array to store return valuse 
  let dt  = [];
  //check if data is available
  // run through the array
  console.log(`numbers offfff ${data.length}`)
  data && Array.isArray(data) && data.length > 0 ? data.forEach(async data_row => {
      //pick a row via id confirm id is not zero
      if(data_row.id && parseInt(data_row.id) > 0)
      {
        //ARG - ROW id , table name
        // select row from sqlite db usign id and table name
        await selectPut(data_row.id, tables, (sqlite_row)=>{
            //COMPARE THE DATA ROW AND THE SQLITE ROW DATA
            compare(sqlite_row, data_row, editable_rows, async (col)=>{
              console.log(`Comparing ${tables} ${data_row.id} ${col[0]} `);
              if(col[0] === 0)
              {
                dt.push(data_row.id);
                await loadUpdate(col[1], tables, data_row.id,  (da)=>{dt.push(data_row.id); console.log(`Updating ${tables} ${data_row.id}`);})
              }else if(col[0] === 1)
              {
                console.log(`to insert`)
                await loadInsert(data_row, tables, (da)=>{dt.push(da); console.log(`Inserting ${tables} ${data_row.id}`);})
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
   //callback(dt); 
};

const loadInsert  = async (data, tables, callback) => {
  const TABLES_NAME = SCHEME[tables].name;
  const TABLES_STRUCTURE = SCHEME[tables].schema;
      await db.insert(TABLES_NAME, TABLES_STRUCTURE, data, (d)=>{
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

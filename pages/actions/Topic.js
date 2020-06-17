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
export const getTopicsDownloadOnlyEx = (topi) => (dispatch, getState) => {
  //START DOWNLOAD
  console.log(`activating ${topi}`)
  dispatch({ type: TOPIC_DOWNLOADING, payload: 1});
  //let instruction_paths = `${path}/instruction/cat/${topi}`;
  let instruction_paths = `${path}/api/`;
  console.log(instruction_paths);
  let params = {
    data:{topicID:topi},
    cat:'all',
    table:'instructions',
    token:config
  }
            //START DOWNLOADING INSTRUCIONS
            axios.get(instruction_paths, {params})
            .then(inst => {
                //START SAVING 
                //CHECK IF INSTRUCTION IS AVAILABLE
                inst && inst.data && Array.isArray(inst.data) && inst.data.length > 0 ? 
                loadDataPromise(inst.data, SCHEME['instruction'].name, SCHEME['instruction'].edits)
                .then( rep =>{
                    let instructionID = [];
                    let instructions = inst.data;
                    instructions.map((row) =>(instructionID.push(row.id)));//START DOWNLOADING QUESTIONS
                    let question_paths = `${path}/api/`;
                    let paramsx = {
                      data:{instructionID:topi},
                      cat:'question',
                      table:'questions',
                      token:config
                    }
                    axios.get(question_paths, {params:paramsx})
                    .then(ques => {
                      //TOTAL QUESTIONS DOWNLOADED FOR THE TOPIC
                      //DISPATCH TOTAL NUMBER FOR THAT TOPIC
                      let question_number = ques.data.length;
                      dispatch({ type:TOPIC_DOWNLOADING_START, topicid:topi, topicquestions:question_number});
                      let questioncount = 0;
                      //LOOP THROUGH QUESTIONS AND SAVE
                     
                        ques.data.forEach(row_ques =>{
                          let newanswers = [];
                          let newdistractors = [];
                          let answer_an = row_ques.answer;
                          let answers_an = answer_an.split(':::::');
                          answers_an.forEach(a =>{
                            let answerArray = a.split(':::');
                            let newanswer = {};
                            newanswer['id'] = parseInt(answerArray[0]);
                            newanswer['name'] = answerArray[1];
                            newanswer['questionID'] = parseInt(row_ques.id);
                            newanswer['type'] = 0;
                            newanswers.push(newanswer);
                          })
                         
                          let distractor_an = row_ques.distractor;
                          let distractors_an = distractor_an.split(':::::');
                          distractors_an.forEach(a =>{
                            let distractorArray = a.split(':::');
                            let newdistractor = {};
                            newdistractor['id'] = parseInt(distractorArray[0]);
                            newdistractor['name'] = distractorArray[1];
                            newdistractor['questionID'] = parseInt(row_ques.id);
                            newdistractors.push(newdistractor);
                          })

                          let qr = {};
                          qr['id'] = row_ques.id;
                          qr['instructionID'] = row_ques.instructionID;
                          qr['question'] = row_ques.question;
                          qr['question_video'] = row_ques.question_video;
                          qr['question_audio'] = row_ques.question_audio;
                          qr['question_image'] = row_ques.question_image;
                          qr['type'] = row_ques.type;
                          qr['option_type'] = row_ques.option_type;
                          qr['issued'] = row_ques.issued;
                          qr['passed'] = row_ques.passed;
                          qr['grp'] = row_ques.grp;
                          qr['active'] = row_ques.active;
                          qr['created_at'] = row_ques.created_at;
                          qr['updated_at'] = row_ques.updated_at;

                        
                        let q_arr = [qr];
                        loadDataPromise(q_arr, SCHEME['question'].name, SCHEME['question'].edits)
                          .then(rep =>{
                            console.log(rep);
                          })
                          .then(an => {
                            newanswers.forEach(row_ans =>{
                              loadDataPromise([row_ans], SCHEME['answer'].name, SCHEME['answer'].edits)
                              .then(r =>{}).catch(e =>{console.log(JSON.stringify(e))})
                            })
                          })
                          .then(di => {
                            newdistractors.forEach(row_dis =>{
                              loadDataPromise([row_dis], SCHEME['distractor'].name, SCHEME['distractor'].edits).then(r_d=>{}).catch(e=>{console.log(JSON.stringify(e))})
                            })
                          })
                          .then(di => {
                            questioncount = questioncount + 1;
                            console.log(`${ questioncount} saved`);
                            dispatch({ type: TOPIC_DOWNLOADING_STATE, topicid:topi, tquestions:questioncount});  
                          })
                          .catch(err => console.log(err))
                        });
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
export const getTopicsDownloadOnly = (topi) => (dispatch, getState) => {
  //START DOWNLOAD
  console.log(`activating ${topi}`)
  dispatch({ type: TOPIC_DOWNLOADING, payload: 1});
  //let instruction_paths = `${path}/instruction/cat/${topi}`;
  let instruction_paths = `${path}/api/`;
  console.log(instruction_paths);
  let params = {
    data:{topicID:topi},
    cat:'all',
    table:'instructions',
    token:config
  }
            //START DOWNLOADING INSTRUCIONS
            axios.get(instruction_paths, {params})
            .then(inst => {
                //START SAVING 
                //CHECK IF INSTRUCTION IS AVAILABLE
                inst && inst.data && Array.isArray(inst.data) && inst.data.length > 0 ? 
                loadDataPromise(inst.data, SCHEME['instruction'].name, SCHEME['instruction'].edits)
                .then( rep =>{
                    let instructionID = [];
                    let instructions = inst.data;
                    instructions.map((row) =>(instructionID.push(row.id)));//START DOWNLOADING QUESTIONS
                    let question_paths = `${path}/api/`;
                    let paramsx = {
                      data:{instructionID:topi},
                      cat:'question',
                      table:'questions',
                      token:config
                    }
                    axios.get(question_paths, {params:paramsx})
                    .then(ques => {
                      console.log(JSON.stringify(ques.data));
                      //TOTAL QUESTIONS DOWNLOADED FOR THE TOPIC
                      //DISPATCH TOTAL NUMBER FOR THAT TOPIC
                      let question_number = ques.data.length;
                      dispatch({ type:TOPIC_DOWNLOADING_START, topicid:topi, topicquestions:question_number});
                      let questioncount = 0;
                      //LOOP THROUGH QUESTIONS AND SAVE
                     
                        ques.data.forEach(row_ques =>{
                          
                          let newanswers = [];
                          let newdistractors = [];
                          let answer_an = row_ques.answer;
                          let answers_an = answer_an.split(':::::');
                          answers_an.forEach(a =>{
                            let answerArray = a.split(':::');
                            let newanswer = {};
                            newanswer['id'] = parseInt(answerArray[0]);
                            newanswer['name'] = answerArray[1];
                            newanswer['questionID'] = parseInt(row_ques.id);
                            newanswer['type'] = 0;
                            newanswers.push(newanswer);
                          })
                         
                          let distractor_an = row_ques.distractor;
                          let distractors_an = distractor_an.split(':::::');
                          distractors_an.forEach(a =>{
                            let distractorArray = a.split(':::');
                            let newdistractor = {};
                            newdistractor['id'] = parseInt(distractorArray[0]);
                            newdistractor['name'] = distractorArray[1];
                            newdistractor['questionID'] = parseInt(row_ques.id);
                            newdistractors.push(newdistractor);
                          })

                          let qr = {};
                          qr['id'] = row_ques.id;
                          qr['instructionID'] = row_ques.instructionID;
                          qr['question'] = row_ques.question;
                          qr['question_video'] = row_ques.question_video;
                          qr['question_audio'] = row_ques.question_audio;
                          qr['question_image'] = row_ques.question_image;
                          qr['type'] = row_ques.type;
                          qr['option_type'] = row_ques.option_type;
                          qr['issued'] = row_ques.issued;
                          qr['passed'] = row_ques.passed;
                          qr['grp'] = row_ques.grp;
                          qr['active'] = row_ques.active;
                          qr['created_at'] = row_ques.created_at;
                          qr['updated_at'] = row_ques.updated_at;

                        
                        let q_arr = [qr];
                        loadDataPromise(q_arr, SCHEME['question'].name, SCHEME['question'].edits)
                          .then(rep =>{
                            console.log(rep);
                          })
                          .then(an => {
                            newanswers.forEach(row_ans =>{
                              loadDataPromise([row_ans], SCHEME['answer'].name, SCHEME['answer'].edits)
                              .then(r =>{}).catch(e =>{console.log(JSON.stringify(e))})
                            })
                          })
                          .then(di => {
                            newdistractors.forEach(row_dis =>{
                              loadDataPromise([row_dis], SCHEME['distractor'].name, SCHEME['distractor'].edits).then(r_d=>{}).catch(e=>{console.log(JSON.stringify(e))})
                            })
                          })
                          .then(di => {
                            questioncount = questioncount + 1;
                            console.log(`${ questioncount} saved`);
                            dispatch({ type: TOPIC_DOWNLOADING_STATE, topicid:topi, tquestions:questioncount});  
                          })
                          .catch(err => console.log(err))
                        });
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
  return new Promise((resolve, reject)=>{
  //let topic_paths = `${path}/topic/mult/n`;
  let topic_paths = `${path}/api/`;
  let theme_id_string = '';
  theme_id_string = themeID && Array.isArray(themeID) ? themeID.toString() : ' ';
  let params = {
    data:{themeID:theme_id_string},
    cat:'topic',
    table:TABLE_NAME,
    token:config
  }
  axios.get(topic_paths, {params})
  .then(top => {
        dispatch({ type: TOPIC_DOWNLOADING_SUCCESS, payload:top.data, id:themeID});
        resolve(top.data);
        loadDataPromise(data, SCHEME['topic'].name, SCHEME['topic'].edits)
              .then(d=>{
                  console.log(`loading and saving topics ${JSON.stringify(d)}`)
              })
              .catch(err=>console.log(err))
        }).catch(err =>reject(err))
    })
}

//GET TOPICS FROM ONLINE DATABANK
const getTopicDB = (themeID) => {
  return new Promise((resolve, reject)=>{
  let thm = []
  let theme_id_string = '';
  theme_id_string = themeID && Array.isArray(themeID) ? themeID.toString() : thm.push(themeID).toString();
  let topic_paths = `${path}/api/`;
  
    let params = {
        data:{themeID:themeID},
        cat:'topic',
        table:TABLE_NAME,
        token:config
    }

  axios.get(topic_paths, {params})
    .then(top => {
        resolve(top.data);
    })
    .catch(err =>{ 
        reject(err);
    })
    })
}
//GET TOPICS FROM ONLINE DATABANK
export const getTopicCount = (topicID) => (dispatch, getState) => {
  //SET PATH TO COUNT QUESTIONS AVAILABLE
  //let topic_paths = `${path}/topic/count/${topicID}`;
  let topic_paths = `${path}/api/`;
  let theme_id_string = '';
  let cat = '';
  
  if(topicID && Array.isArray(topicID) && topicID.length == 1)
  {
    theme_id_string = topicID && Array.isArray(topicID) ? topicID.toString() : '';
    cat = 'count';
  }
  if(topicID && parseInt(topicID) > 0)
  {
    theme_id_string = topicID.toString();
    cat = 'count';
  }
  let params = {
    data:{topicID:theme_id_string},
    cat:cat,
    table:TABLE_NAME,
    token:config
  }
  //FETCH QUESTION NUMBER
  axios.get(topic_paths, {params})
      .then(top => {
        let on_top = top && Array.isArray(top.data) && top.data.length > 0 ? top.data[0].id: 0;
        //IF NO QUESTION ONLINE: STATE THAT
        //FETCH NO OF QUESTIONS OFFLINE DB
        db.selectCountQuestions(topicID, (data)=>{
          let off_top = data && Array.isArray(data._array) && data._array.length > 0 ? data._array[0].id : 0;
          //IF THE QUESTIONS ARE EQUAL DO NOTHING
          on_top != 0 && on_top == off_top ? dispatch({ type: TOPIC_UPDATING_STATE, topicID:topicID, status:2}) : null ; 
          //IF ONLINE IS MORE THAN OFFLINE ASK FOR UPDATE
          on_top != 0 && on_top > off_top ? dispatch({ type: TOPIC_UPDATING_STATE, topicID:topicID, status:1}) : null ; 
        })
        }).catch(err =>console.log(err))
      
}

//GET ALL TOPIC
export const getTopics = (theme) => (dispatch) => {
  dispatch({ type: TOPIC_LOADING});
  theme && Array.isArray(theme) ? 
  theme.forEach(id => {
    console.log(id);
      let PARAM = {themeID : id};
      db.selectTopicPromise(TABLE_NAME, PARAM)
      .then(data=>{
        if(Array.isArray(data._array) && data._array.length > 0)
        {
          //DATA WAS DOWN LOADED OFFLINE
          dispatch({ type: TOPIC_GET_MULTIPLE, payload: data._array, status:3});
        }else   
        {
          //NO DOWNLOAD FROM OFFLINE TRY ONLINE
          getTopicDB(id)
          .then(data =>{
                if(data && data.length > 0)
                {
                  console.log('ggggag'+data);
                  dispatch({ type: TOPIC_GET_MULTIPLE, payload: data, status:3});
                  loadDataPromise(data, SCHEME['topic'].name, SCHEME['topic'].edits)
                  .then(d=>{
                      console.log(`loading and saving topics ${JSON.stringify(d)}`)
                  })
                  .catch(err=>console.log(err))
                }     
          })
          .catch(err=>{
            console.log(err)
          })
        }
      })
    .catch(err=>{
      console.log('pos3');
        getTopicDB(id)
        .then(data =>{
          dispatch({ type: TOPIC_DOWNLOADING_SUCCESS, payload:data, id:id});
              loadDataPromise(data, SCHEME['topic'].name, SCHEME['topic'].edits)
              .then(d=>{
                  console.log(`loading and saving topics ${JSON.stringify(d)}`)
              })
              .catch(err=>console.log(err))
        })
        .catch(err=>{
          console.log(err)
        })
      })
    }): 
    db.selectTopicPromise(TABLE_NAME, {themeID : theme})
    .then((data)=>{
      if(data == 1)
      {
        console.log('single main fail');
        dispatch({type: TOPIC_LOADING_ERROR, msg: 'No Data'});
      }else{
        console.log('single main success');
        dispatch({ type: TOPIC_GET_MULTIPLE, payload: data._array, status:3});
      }  
    })
    .then(dataa=>{
      getTopicDB(theme)
        .then(data =>{
          dispatch({ type: TOPIC_DOWNLOADING_SUCCESS, payload:data, id:theme});
              // loadDataPromise(data, SCHEME['topic'].name, SCHEME['topic'].edits)
              // .then(d=>{
              //     console.log(`loading and saving topics ${JSON.stringify(d)}`)
              // })
              // .catch(err=>console.log(err))
        })
        .catch(err=>{
          console.log(err)
        })
    })
  .catch(err=>{
    getTopicDB(theme)
    .then(data =>{
      dispatch({ type: TOPIC_DOWNLOADING_SUCCESS, payload:data, id:theme});
          loadDataPromise(data, SCHEME['topic'].name, SCHEME['topic'].edits)
          .then(d=>{
              console.log(`loading and saving topics ${JSON.stringify(d)}`)
          })
          .catch(err=>console.log(err))
    })
    .catch(err=>{
      console.log(err)
    })
    })

};

//GET ALL TOPIC
export const getTopicsDB = (topics, themes) => (dispatch) => {
  let PARAM = topics ? {id : topics}: {themeID : themes};
  db.selectTopicPromise(TABLE_NAME, PARAM)
  .then((data)=>{
    if(data == 1)
    {
      dispatch({type: TOPIC_LOADING_ERROR, msg: 'No Data'})
     }else
     {
      dispatch({ type: TOPIC_GET_MULTIPLE, payload: data._array});
     }  
  })
  .catch(err=>{
    dispatch({type: TOPIC_LOADING_ERROR, msg: 'No Data'})
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
  dispatch({ type: TOPIC_GET_ONE, payload:id})
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
 console.log(data_row.id);
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
    .catch(error=>{reject(`${tables} id ${id} not found in offline DB`) })    
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

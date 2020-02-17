import {
  TOPIC_GET_MULTIPLE,
  TOPIC_GET_SELECTED,
  TOPIC_EDIT_SUCCESS, 
  TOPIC_GET_ONE, 
  TOPIC_LOADING,
  TOPIC_LOADING_ERROR,
  TOPIC_DOWNLOADING,
  TOPIC_DOWNLOADING_SUCCESS,
  TOPIC_DOWNLOADING_FAIL
} from "../types/Topic";

import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG, LOADDATA, DROPDATA } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;
const config = CONFIG;
const loadData = LOADDATA;
const dropData = DROPDATA;

const TABLE_NAME = SCHEME.topic.name;
const TABLE_STRUCTURE = SCHEME.topic.schema;

//GET TOPICS FROM ONLINE DATABANK
export const getTopicsDownload = (themeID) => (dispatch, getState) => {
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

  theme_id_string = themeID && Array.isArray(themeID) ? themeID.toString() : ' ';
  axios.patch(topic_paths, {themeID:theme_id_string}, config(getState)).then(top => {
        dispatch({ type: TOPIC_DOWNLOADING, payload: 2});
        dispatch({ type: TOPIC_DOWNLOADING_SUCCESS, payload:top.data, id:themeID});
        loadData(top.data, 'topic');
        let topics = top.data;
        topics.map((row) =>(topicID.push(row.id)));
        topic_id_string = topicID && Array.isArray(topicID) ? topicID.join(',') : '';

        axios.patch(instruction_paths, {topicID:topic_id_string}, config(getState)).then(async inst => {
            dispatch({ type: TOPIC_DOWNLOADING, payload: 3});
            await loadData(inst.data, 'instruction');
            let instructions = inst.data;
            instructions.map((row) =>(instructionID.push(row.id)));
            instruction_id_string = instructionID && Array.isArray(instructionID) ? instructionID.toString() : '';
            
            axios.patch(question_paths, {instructionID:instruction_id_string}, config(getState)).then(async ques => {
              dispatch({ type: TOPIC_DOWNLOADING, payload: 4});
              await loadData(ques.data, 'question');
              let questions = ques.data;
              questions.map((row) =>(questionID.push(row.id)));
              question_id_string = questionID && Array.isArray(questionID) ? questionID.toString() : '';
              
              axios.patch(answer_paths, {questionID :question_id_string}, config(getState)).then(async ques => {
                dispatch({ type: TOPIC_DOWNLOADING, payload: 6});
                await loadData(ques.data, 'answer');
                }).catch(err => {dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})

              axios.patch(distractor_paths, {questionID :question_id_string}, config(getState)).then(async ques => {
                dispatch({ type: TOPIC_DOWNLOADING, payload: 7});
                await loadData(ques.data, 'distractor');
                }).catch(err => {dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})

              }).catch(err => {dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})
            }).catch(err => {dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})
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
          }).catch(err => {console.log(err); dispatch({type : TOPIC_DOWNLOADING_FAIL, payload: 10})})
}


//GET ALL TOPIC
export const getTopics = (theme) => (dispatch) => {
  dispatch({ type: TOPIC_LOADING})
      theme.forEach(id => {
      let PARAM = {themeID : id};
      db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
        console.log(data.length);
        data == 1 ? null : dispatch({ type: TOPIC_GET_MULTIPLE, payload: data._array, status:3}); 
      })
      dispatch({type: TOPIC_LOADING_ERROR, msg: 'No Data'})
    });
    
 
};

//GET ALL TOPIC
export const getTopicsDB = (topics) => (dispatch) => {
  let PARAM = {id : topics};
  db.selectIN(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
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
      id:id
    })
    callback(id);
  })
};

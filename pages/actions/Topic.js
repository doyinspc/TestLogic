import {
    TOPIC_GET_ONE, 
    TOPIC_LOADING_ONLINE, 
    TOPIC_LOADING_ONLINE_ERROR, 
    TOPIC_LOADING,
    TOPIC_LOADING_ERROR,
    TOPIC_GET_MULTIPLE,
    TOPIC_GET_MULTIPLE_ONLINE,
    TOPIC_GET_SELECTED

} from "../types/Topic";

import axios from 'axios';
import { API_PATH, DB_PATH, CONFIG } from './Common';
import  SCHEME  from './../api/Schema';

const db = DB_PATH;
const path = API_PATH;   
const config = CONFIG;

const TABLE_NAME = SCHEME.topic.name;
const TABLE_STRUCTURE = SCHEME.topic.schema;

//GET TOPICS FROM ONLINE DATABANK
export const getTopicsCloud = (themeID) => (dispatch, getState) => {
  dispatch({ type: TOPIC_LOADING_ONLINE, payload: 1});
  
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
  axios.patch(topic_paths, theme_id_string, config(getState)).then(top => {
        dispatch({ type: TOPIC_LOADING, payload: 2});
        dispatch({ type: TOPIC_GET_MULTIPLE_ONLINE, payload: top.data, id:themeID});
        loadData(top.data, 'topic');
        let topics = top.data;
        topics.map((row) =>(topicID.push(row.id)));
        topic_id_string = topicID && Array.isArray(topicID) ? topicID.toString() : '';

        axios.patch(instruction_paths, topic_id_string, config(getState)).then(inst => {
            dispatch({ type: TOPIC_LOADING, payload: 3});
            loadData(inst.data, 'instruction');
            let instructions = inst.data;
            instructions.map((row) =>(instructionID.push(row.id)));
            instruction_id_string = instructionID && Array.isArray(instructionID) ? instructionID.toString() : '';
            
            axios.patch(question_paths, instruction_id_string, config(getState)).then(ques => {
              dispatch({ type: TOPIC_LOADING, payload: 4});
              loadData(ques.data, 'question');
              let questions = ques.data;
              questions.map((row) =>(questionID.push(row.id)));
              question_id_string = questionID && Array.isArray(questionID) ? questionID.toString() : '';
              
              axios.patch(answer_paths, question_id_string, config(getState)).then(ques => {
                dispatch({ type: TOPIC_LOADING, payload: 6});
                loadData(ques.data, 'answer');
                }).catch(err => {dispatch({type : TOPIC_LOADING_ONLINE_ERROR, payload: 10})})

              axios.patch(distractor_paths, question_id_string, config(getState)).then(ques => {
                dispatch({ type: TOPIC_LOADING, payload: 6});
                loadData(ques.data, 'distractor');
                }).catch(err => {dispatch({type : TOPIC_LOADING_ONLINE_ERROR, payload: 10})})

              }).catch(err => {dispatch({type : TOPIC_LOADING_ONLINE_ERROR, payload: 10})})
            }).catch(err => {dispatch({type : TOPIC_LOADING_ONLINE_ERROR, payload: 10})})
          }).catch(err => {dispatch({type : TOPIC_LOADING_ONLINE_ERROR, payload: 10})})
}


//GET ALL TOPIC
export const getTopics = (theme) => (dispatch) => {
    let thm = theme.split(',');
    let PARAM = {themeID : thm,};
    dispatch({ type: TOPIC_LOADING})
    db.selectIN(TABLE_NAME, TABLE_STRUCTURE, PARAM, (data)=>{
      data == 1 ? dispatch({type: TOPIC_LOADING_ERROR, payload: data._array}) : dispatch({ type: TOPIC_GET_MULTIPLE, payload: top.data, id:theme}); 
    })
};

//SELECT SINGLE THEME FROM TOPICS
export const getTopic = (id) => (dispatch) => {
  dispatch({ type: TOPIC_GET_ONE, payload: id})
};

//KEEP SELECTED TOPICS
export const getTopicsSelected = (ids) => (dispatch) => {
  dispatch({ type: TOPIC_GET_SELECTED, payload: ids})
};


loadData  = (data, tables) =>{
  const TABLES_NAME = SCHEME[tables].name;
  const TABLES_STRUCTURE = SCHEME[tables].schema;
  let dt  = [];
    data.forEach(element => {
      db.insert(TABLES_NAME, TABLES_STRUCTURE, element, (data)=>{
        if(data == 'xx')
        {
          // failed to insert
        }
        else if(data > 0)
        {
          console.log(`${TABLES_NAME} DONE ${data}`)
          dt.push(data);
        }
      })
   });
   return dt;
};


import { combineReducers } from 'redux';
import subject from'./Subject';
import resource from'./Resource';
import theme from'./Theme';
import topic from'./Topic';
import question from'./Question';
import test from'./Test';
import score from'./Score';
import user from'./User';

export default combineReducers({
    subjectReducer:subject,
    resourceReducer:resource,
    themeReducer:theme,
    topicReducer:topic,
    questionReducer:question,
    testReducer:test,
    scoreReducer:score,
    userReducer:user,
});
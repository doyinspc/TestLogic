import { combineReducers } from 'redux';
import subject from'./Subject';
import theme from'./Theme';
import topic from'./Topic';
import test from'./Test';
import score from'./Score';
import user from'./User';

export default combineReducers({
    subjectReducer:subject,
    themeReducer:theme,
    topicReducer:topic,
    testReducer:test,
    scoreReducer:score,
    userReducer:user,
});
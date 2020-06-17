'use strict';

import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { ThemeProvider, Icon, Button, ButtonGroup, Overlay } from 'react-native-elements';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { RadioButton } from 'react-native-paper';
import * as Font from 'expo-font';
import Accordion from './components/Accordion'
import OptionsButton from './components/OptionsButton';
import Activity from './components/LoaderTest';
import Question from './components/Question';
import { getTest, getTestPromise } from './actions/Test';
import { getScore, getScorePromise, insertScore, updateScore } from './actions/Score';
import WebView from 'react-native-webview';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;
// Your App
class QuestionScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      instructions: {},
      ids:{},
      questions:{},
      options:{},
      choices:{},
      timespent:{},
      answers:{},
      checks:{},
      fontLoaded: false,
      testID:null,
      scoreID:null,
      isRetest: false,
      settime: null,
      settimer: null,
      noq: null,
      tim: null,
      ans: null,
      activeNumber: 1,
      activeIndex: 0,
      activeTime: 0,
      gestureName: 'none',
      currentTime:'',
      starttime: Math.floor(new Date().getTime()),
      endtime: Math.floor(new Date().getTime()),
      starting: new Date().getTime(),
      selectedIndex: 2,
      score: 0,
      isVisible: false,
      isCompleted: null,
    };
  }

async componentDidMount(){
   //get the test id stor in state
  let testID = this.props.navigation.getParam('testID');
  this.setState({ testID:testID });
  //load test from test table
  this.props.getTestPromise(testID)
  .then(test_data =>{
      let timing = test_data.testtime;
      let cur = 0;
      //timing = timing.map(Number);
      // if(timing[0] === -1)
      // {
      //       cur = 0;
      // }
      // else
      // {
      //     // let sec = timing[2] > 0 ? timing[2]: 0;
      //     // let min = timing[1] > 0 ? timing[1] * 60: 0;
      //     // let hr  = timing[0] > 0 ? timing[0] * 60 * 60 : 0;
      //     // cur = hr + min + sec;
      // }
       
        //set sata in state
        let settings = test_data.settings.split(':::');
        let time_store = {};
        let ids = JSON.parse(test_data.ids);
        let time_span = parseInt(settings[1]) === 2 ? timing : null;
        //SHARE THE TIMING EVENLY FOR EACH QUESTION
        //IF OPTION 2
        time_span && Array.isArray(ids) && ids.length > 0 ? ids.forEach(id => {
          time_store[parseInt(id)] = parseInt(time_span);
        }): null;
        //IF OPTION ONE LEAVE TIME
        //IF OPTION TWO SHARE TIME  
        let testtime = parseInt(settings[1]) === 2 ? time_store : timing;
        this.setState({
            ids: ids,
            instructions: JSON.parse(test_data.instructions),
            questions: JSON.parse(test_data.questions),
            options: JSON.parse(test_data.options),
            answers: JSON.parse(test_data.answers),
            settime: testtime,
            noq: settings[0],
            tim: settings[1],
            ans: settings[2],
            activeNumber: JSON.parse(test_data.ids)[0]
        })
        
      //GET SCOREID
      let scoreID = this.props.navigation.getParam('scoreID');
      //CHECK IF SCORE WAS SET
      //IF SCORE IS AVAILABLE IT IS A RETEST
      if(scoreID && parseInt(scoreID) > 0)
      {
        //SCORE IS SET: THIS IS A RETEST
        //GET THE SCORE DATA
        this.props.getScorePromise(scoreID)
        .then( da =>{
            //IF SCORE IS SET AND TEST IS ACTIVE MEANS IT IS NOT A CONTINUATION
            let isComp = da.score && parseInt(da.active) === 1 ? true : false;
            this.setState({ 
                choices: da.choices !== undefined && Object.keys(da.choices).length > 0 ? JSON.parse(da.choices): {},
                testtime: da.timespent !== undefined ? JSON.parse(da.timespent):{}, 
                timespent: da.timespent !== undefined ? JSON.parse(da.timespent):{}, 
                timeleft: da.timeleft, 
                score: da.score, 
                isCompleted: isComp, 
                isRetest:true, 
                scoreID: scoreID
            });
        })
        .catch(err=>{
          //NO SCORE WAS SET MEANING ITS A NEW TEST SCORE
          //SO SET DEFAULT VALUES
          let arr = {};
          arr['testID'] = testID;
          arr['score'] = 0;
          arr['timeset'] = cur;
          arr['settings'] = test_data.settings;
          arr['timespent'] = JSON.stringify({}); 
          arr['timeleft'] = JSON.stringify(test_data.testtime);
          arr['choices'] = JSON.stringify({});
        
          this.props.insertScore(arr)
          .then(id=>{
            this.setState({ isRetest:false , scoreID : id, isCompleted: false  });
            this.props.getScore(id);
          })
          .catch(err =>{
            Alert.alert('Error Score inputs', JSON.stringify(err));
          })

        })
        
      }else{
        //NO SCORE WAS SET MEANING ITS A NEW TEST SCORE
        //SO SET DEFAULT VALUES AND SAVE

        let arr = {};
        arr['testID'] = testID;
        arr['score'] = 0;
        arr['timeset'] = cur;
        arr['settings'] = test_data.settings;
        arr['timespent'] = JSON.stringify({}); 
        arr['timeleft'] = JSON.stringify(test_data.testtime);
        arr['choices'] = JSON.stringify({});
        
        this.props.insertScore(arr)
        .then(id=>{
          this.setState({ isRetest:false , scoreID: id , isCompleted: false});
          this.props.getScore(id);
        })
        .catch(err =>{
          Alert.alert('Error Score input', JSON.stringify(err));
        })
      }
  })
  .catch(err=>{
    Alert.alert('Error', JSON.stringify(err));
  })
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true });
  this.timer = setInterval(()=>{ this.getCurrentTime(); }, 1000);
 }

 //record the score
setChoice=(questionID, selectionID)=>{

      //STAGE ONE : SET CHOICE
      let ch = {...this.state.choices};
      ch[questionID] = selectionID;
      this.setState({choices:ch});
      //QUESION HAS NOT BEEN ANSWERED
      //DETERMINE IF IT IS FIRST OCCURANCE OR RETURN
      //IF FIRST OCCURANCE GET CURRENT TIME SUBTRACT FROM STRATING TIME AND STORE
      //IF NOT FIRST TIME , GET THE LAST TIME ADD CURRENT CHANGES AND SAVE
      let old_starting_time = this.state.starting;    //GET TIME QUESTION WAS PRESENTED
      let all_timespents = {...this.state.timespent}; //GET OBJECT OF ALL TIME SPENT
      let old_timespent = all_timespents[questionID] ? all_timespents[questionID] : 0 ; // IF TIME SET FOR CURRENT ID ISSET USE ELSE SET TO ZERO
      let current_time = new Date().getTime();
      let time_difference = current_time - old_starting_time;
      let real_timespent = old_timespent + Math.floor(time_difference/1000);
      all_timespents[questionID] = real_timespent;
      console.log(all_timespents);
      //STAGE TWO : SET TIMING
      if(parseInt(this.state.tim) === 2)
      {
        //SEPARATE TIMING
        let settimes = {...this.state.settime};
        let cur = 0; 
        let currenttime = this.state.currentTime.split(':');
        
        currenttime = currenttime.map(Number);
        if(currenttime[0] === -1)
        {
            cur = 0;
        }
        else
        {
          let sec = currenttime[2] > 0 ? currenttime[2] : 0;
          let min = currenttime[1] > 0 ? currenttime[1] * 60 : 0;
          let hr  = currenttime[0] > 0 ? currenttime[0] * 60 * 60 : 0;
          cur = hr + min + sec;
        }
        settimes[this.state.activeNumber] = cur;
        this.setState({settime:settimes, settimer:settimes, timespent:all_timespents});
      }
    else if(parseInt(this.state.tim) === 1)
    {
      //SINGLE TIMING
      let settimes = {...this.state.settime};  //GET ALL TIME STORED
      let ending = Math.floor(new Date().getTime()/1000); //GET CURRENT TIME IN SECONDS
      let lasttime = settimes[this.state.activeNumber.toString()] ? settimes[this.state.activeNumber] : 0; //GET PREVIOS TIME FOR PARTICULAR ID
      let cur = lasttime + (ending - this.state.starting); // SUBTRACT NOW FROM TIME STARTED ANDADD LAST TIME USED, IF ANY
      settimes[this.state.activeNumber] = cur; //STORE IN OBJECT
      this.setState({settimer: settimes, timespent:all_timespents}); //SET STATE
    }
      
 }
 //mark the test and record
markTest=()=>{
  let { answers, choices, scoreID, testtime, testID, settime, timespent } = this.state;
  let correctAnswers = [];

  for(let i in answers)
  {
    let d = Object.keys(answers[i])[0];
    if(choices[i] == d){
       correctAnswers.push(d);
    }
  };

  let score = correctAnswers.length > 0 && Object.keys(answers).length > 0 ? (correctAnswers.length / Object.keys(answers).length) : 0 ;
  let arr = {}
  arr['score']  = score.toString();
  arr['choices']  = JSON.stringify(choices);
  arr['timespent']  = JSON.stringify(timespent);
  arr['timeleft']  = JSON.stringify(settime);
  arr['active']  = 1;
  this.props.updateScore(arr, scoreID)
  .then(data =>{
    this.props.navigation.navigate('ScoreScreen', {'testID': testID, 'scoreID':scoreID });
  }).catch(err=>{
    Alert.alert('Failed', JSON.stringify(err));
  })
  
}
storeTest=()=>{
   //pause test save questions
      //exit to score screen
      let {choices, timeleft, scoreID, testID, settime, timespent } = this.state;
      //1. set up an array of items to store
      let arr = {};
      arr['choices'] = JSON.stringify(choices);
      arr['timespent']  = JSON.stringify(timespent);
      arr['timeleft']  = JSON.stringify(settime)
      arr['active']  = 2;
      //2. get the id to store the data
      let scoreIDs = scoreID;
      //3. update the score database
      this.props.updateScore(arr, scoreID)
      .then(data =>{
        this.props.navigation.navigate('ScoreScreen', {'testID': testID, 'scoreID':scoreID });
      }).catch(err=>{
        Alert.alert('Failed', JSON.stringify(err));
      })
}
 //swipe
onSwipeUp=(gestureState)=> {
   //show all question numbers
  //this.setState({myText: 'You swiped up!'});
}
onSwipeDown=(gestureState)=>{
  //hid all question numbers
  this.setState({isVisible:true});
}
onSwipeLeft=(gestureState)=> {
  
  this.onForward();
  
}
onSwipeRight=(gestureState)=> { 
  this.onBackward()
}
changeQuestion=(activeIndex, activeNumber)=> {

    this.setState({activeIndex: activeIndex, activeNumber: activeNumber, isVisible:false});
 
}
onForward=()=> {
  //CURRENT INDEX
  let oldIndex = this.state.activeIndex;
  //NEXT INDEX
  let newIndex = oldIndex + 1;
  //IF THE NEXT INDEX IS LESS THAN THE TOTAL NUMBER OF QUESTIONS
  if(newIndex < Object.keys(this.state.answers).length)
  {
    //GET THE NEXT ACTIVE NUMBER
    let newActiveNumber = this.state.ids[newIndex];
    //GET THE CURRENT ACTIVE NUMBER
    let oldActiveNumber = this.state.activeNumber;
    // CONFIRM THE TIMING TYPES
    if(parseInt(this.state.tim) === 2)
    {
      let settimes = {...this.state.settime};
      let cur = 0; 
      let currenttime = this.state.currentTime.split(':');
      currenttime = currenttime.map(Number);
      if(currenttime[0] === -1)
      {
          cur = 0;
      }
      else
      {
        let sec = currenttime[2] > 0 ? currenttime[2]: 0;
        let min = currenttime[1] > 0 ? currenttime[1] * 60: 0;
        let hr  = currenttime[0] > 0 ? currenttime[0] * 60 * 60 : 0;
        cur = hr + min + sec;
      }
      settimes[oldActiveNumber] = cur;
      
      this.setState({
        activeIndex: newIndex, 
        activeNumber: newActiveNumber,
        settime: settimes,
        starttime: Math.floor(new Date().getTime()),
      });

    }else if(parseInt(this.state.tim) === 1)
    {
      //OPTION ONE USE SINGLE TIMING
      //CONFIRM IF QUESTION HAS BEEN ANSWERED
      let did = oldActiveNumber.toString();
      let sc = this.state.choices[did] && this.state.choices[did] !== undefined ? this.state.choices[did] : null ;
      
      if(sc && sc.length > 0 && sc != null)
      {
         //IF THE QUESTION HAS BEEN ANSWERED
         //NO NEED TO STORE THE TIME SPENT
         //RESET STARTING FOR NEXT QUESTION
        let settimes = {...this.state.settime};
        let ending = Math.floor(new Date().getTime()/1000);
        let lasttime = settimes[oldActiveNumber.toString()] ? settimes[oldActiveNumber] : 0;
        let cur = lasttime + (ending - this.state.starting);
        settimes[oldActiveNumber] = cur;

        this.setState({
          activeIndex: newIndex, 
          activeNumber: newActiveNumber,
          starting: new Date().getTime(),
        });
      }else
      {
        
        this.setState({
          activeIndex: newIndex, 
          activeNumber: newActiveNumber,
          starting: new Date().getTime(),
        });
      }
    }
    else
    {
      this.setState({
        activeIndex: newIndex, 
        activeNumber: newActiveNumber
      });
    }
  
  }
}
onBackward=()=> {
  let oldIndex = this.state.activeIndex;
  let newIndex = oldIndex - 1;
  if(newIndex > -1)
  {
    let newActiveNumber = this.state.ids[newIndex];
    let oldActiveNumber = this.state.activeNumber;
    if(parseInt(this.state.tim) === 2)
    {
      let settimes = {...this.state.settime};
      let cur = 0; 
      let currenttime = this.state.currentTime.split(':');
      currenttime = currenttime.map(Number);
      if(currenttime[0] === -1)
      {
          cur = 0;
      }
      else
      {
        let sec = currenttime[2] > 0 ? currenttime[2]: 0;
        let min = currenttime[1] > 0 ? currenttime[1] * 60: 0;
        let hr  = currenttime[0] > 0 ? currenttime[0] * 60 * 60 : 0;
        cur = hr + min + sec;
      }
      settimes[oldActiveNumber] = cur;
      
      this.setState({
        activeIndex: newIndex, 
        activeNumber: newActiveNumber,
        settime: settimes,
        starttime: Math.floor(new Date().getTime()),
        starting: new Date().getTime(),
      });

    }else{
      this.setState({
        activeIndex: newIndex, 
        activeNumber: newActiveNumber,
        starting: new Date().getTime(),
      });

    }
  }
}
updateIndex = (selectedIndex) =>{
  this.setState({ selectedIndex });
 if(selectedIndex == 0 )
  {
    if(this.state.isCompleted)
    {
      this.props.navigation.navigate('ScoreScreen', {'testID': this.state.testID, 'scoreID': this.state.scoreID });
    }else
    {
      this.storeTest();
    }
      
  }
  else if(selectedIndex == 1 )
  {
      this.markTest();
  }
  
}
onSwipe=(gestureName, gestureState)=> {
  const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
  
  switch (gestureName) {
    case SWIPE_UP:
      break;
    case SWIPE_DOWN:
      break;
    case SWIPE_LEFT:
      break;
    case SWIPE_RIGHT:
      break;
  }
}
getCurrentTime = () =>{
    let { settime, starttime, tim, activeIndex, activeNumber, choices, isCompleted, timespent } = this.state;
    if(isCompleted === false)
    {
    let stime = parseInt(tim) === 2 ? settime[activeNumber] : settime;
    let now = Math.floor(new Date().getTime());
    let diff = 0;
    let did = activeNumber && activeNumber != undefined ? activeNumber.toString(): 1;
    let sc = choices[did] && choices[did] !== undefined ? choices[did] : null ;
    
    if(parseInt(tim) === 2)
    {
      if(sc && sc.length > 0 && sc != null)
      {
        diff = 0;
      }else
      {
        diff = now - starttime;
      }
    }
    if(parseInt(tim) === 1)
    {
      diff = now - starttime; 
    }
    
    let timeLeft =  diff > 0 ? stime - Math.floor(diff/1000) : stime;
    //CONFIRM IF TIME IS LEFT
    if(timeLeft >= 0)
    {
      let hours = timeLeft/(60 * 60);
      let hour = Math.floor(hours);
      let mins = (timeLeft - (hour * 60 * 60)) / 60;
      let min = Math.floor(mins);
      let sec = timeLeft - ((hour * 60 * 60) + (min * 60)) ;
      hour = hour > 0 ? hour : '--';
      min = min > 0 ? min : '--';
      sec = sec > 0 ? sec : '--';
      this.setState({currentTime: `${hour} : ${min} : ${sec}` });
    }else if(isCompleted === true)
    {
      //IF THE TIMER SELECTED IS 1: SUBMIT WHEN TIME IS BELOW 0
      if(parseInt(tim) === 1)
      {
        this.markTest();
      }
      //IF THE TIMER SELECTED IS 2: RESET THE TIME WHEN QUESTION CHANGES
      if(parseInt(tim) === 2)
      {
        sc && sc.length > 0 ? this.setChoice(activeNumber, sc) : this.setChoice(activeNumber, '000');
      }
    }
  }
  else
  {
    let timeLeft = timespent && timespent[activeNumber.toString()]? timespent[activeNumber.toString()] : 0;
    let hours = timeLeft/(60 * 60);
    let hour = Math.floor(hours);
    let mins = (timeLeft - (hour * 60 * 60)) / 60;
    let min = Math.floor(mins);
    let sec = timeLeft - ((hour * 60 * 60) + (min * 60)) ;
    hour = hour > 0 ? hour : '--';
    min = min > 0 ? min : '--';
    sec = sec > 0 ? sec : '--';
    this.setState({currentTime: `${hour} : ${min} : ${sec}` });
  }
}
componentWillUnmount(){
  this.setState({
    instructions: {},
      ids:{},
      questions:{},
      options:{},
      choices:{},
      timespent:{},
      answers:{},
      checks:{},
      fontLoaded: false,
      testID:null,
      scoreID:null,
      isRetest: false,
      settime: null,
      settimer: null,
      noq: null,
      tim: null,
      ans: null,
      activeNumber: 1,
      activeIndex: 0,
      activeTime: 0,
      gestureName: 'none',
      currentTime:'',
      starttime: Math.floor(new Date().getTime()),
      endtime: Math.floor(new Date().getTime()),
      starting: new Date().getTime(),
      selectedIndex: 2,
      score: 0,
      isVisible: false,
      isCompleted: null,
  })
}

comp1 = () => <Icon name='pause'color='white'   type='material' />
comp2 = () => <Icon name='done' color='white'   type='material' />
comp3 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Score {Math.floor(this.state.score * 100)}% : Next</Text>

render(){
 const { isRetest, fontLoaded, activeNumber, activeIndex, selectedIndex, ids, options, choices, questions, answers, instructions, currentTime, ans, tim, isCompleted } = this.state;
 const buttons = isCompleted ? [{element:this.comp3}] :  [{element:this.comp1}, {element:this.comp2}];
 
 const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };
  
  let mainIDs = activeNumber;
  let mainID = mainIDs && mainIDs != undefined ? mainIDs.toString() : '1';

  let li = ids && Array.isArray(ids) ? ids.map((l, i)=>(
          <Button 
          key={i} 
          color= 'white'          
          buttonStyle={{backgroundColor: choices[l] ?  ans == 1 ? 'black': choices[l] == Object.keys(answers[l])[0] ? 'green' : 'red' : local_color.color3 ,  minWidth:50, height: 40, alignContent:'center', margin:10, padding:0 }}
          title={(i + 1).toString()}
          titleStyle={{color:'white'}}
          onPress={()=>this.changeQuestion(i, l)}
          />
  )): null;
  if(!isCompleted)
  {
    this.getCurrentTime;
  }
 
  return (
    <ThemeProvider>
      <View style={{flex:1}}> 
        {fontLoaded && ids.length > 0  && isCompleted !== null?
        <>
        <Overlay
          isVisible={this.state.isVisible}
          windowBackgroundColor="rgba(7, 7, 7, .3)"
          overlayBackgroundColor= {local_color.color4}
          margin='auto'
          padding="auto"
          width="auto"
          height="auto"
        >
          <ScrollView>
          <View style={{flexDirection:'row', flexWrap:'wrap', margin:0, justifyContent:'center', alignContent:'center'}}>
             { li }
          </View>
          <Button
                title='Close'
                style={styles.but}
                onPress={()=>this.setState({isVisible:false})}
                buttonStyle={{backgroundColor:local_color.color1}}
            />
          </ScrollView>
        </Overlay>
        
          <View style={{flex:.5, flexDirection:'row', justifyContent:'space-between', top:0, margin:10, padding:10, backgroundColor: local_color.color5, borderRadius:5,}}>
            <Text style={{fontFamily:'PoiretOne', fontSize:15, marginTop:2}} >{` Question ${activeIndex + 1}.`}</Text>
            <View style={{flexDirection:'row-reverse', justifyContent:'flex-end'}}>
                <Text style={{fontFamily:'PoiretOne', fontSize:15, minWidth:110}}>{`  ${currentTime}`}</Text>
                <Icon name='alarm' type='material' />
            </View>
          </View>

          <GestureRecognizer
            onSwipe={this.onSwipe}
            onSwipeUp={this.onSwipeUp}
            onSwipeDown={this.onSwipeDown}
            onSwipeLeft={this.onSwipeLeft}
            onSwipeRight={this.onSwipeRight}
            config={config}
            style={{
              flex: 8,
              backgroundColor: local_color.color4
            }}
            >
            <ScrollView>
              <View style={{flex:1, flexDirection:'column', flexGrow:1, margin:10, padding:15, justifyContent:'space-evenly', backgroundColor: local_color.color5, borderRadius:15, minHeight:450}}>
               <View style={{borderBottomWidth: 0.5, borderBottomColor:local_color.color4, marginBottom: 5}}>
                <Text style={{fontFamily:'PoiretOne', marginBottom:10, color:local_color.color2}}>{ questions[mainID][0] && instructions[questions[mainID][0]][0] ? instructions[questions[mainID][0]][0]: 'Choose the Right option'}</Text>
               </View>
               {/* INSTRUCTION PASSAGE PLACED HERE IF NO PASSAGE INSTRUCTION SHOULD NOT DISPLAY */}
               { instructions[questions[mainID][0]][2] && instructions[questions[mainID][0]][2].length > 0 ?
                <View style={{flex:1, margin:0}} >
                  <Accordion
                      title = {instructions[questions[mainID][0]][1]}
                      data = { instructions[questions[mainID][0]][2]}
                  />
                </View>
                : null }
                {/* INSTRUCTION PASSAGE ENDS HERE */}

                {/* QUESTION STARTS HERE */}
                <Question data={questions[mainID][1]}/>
                
                {/* QUESTION ENDS HERE */}

                {/* OPTIONS STARTS HERE */}
                <View style={{flex: 1, bottom:10, paddingTop:20}} >
                {options[mainID]  ? options[mainID].map(element =>(
                  <View key={`${activeNumber}'-'${element[0]}`} style={{flex: 1, marginHorizontal:2, marginVertical:4}} >
                      <OptionsButton 
                        key={`${activeNumber}'--'${element[0]}`}  
                        option={`${element[1]}`} 
                        status={ choices[activeNumber] && choices[activeNumber] === element[0] ? 1 : choices[activeNumber] && choices[activeNumber] !== element[0] ? 2 : 3 }
                        disable={ choices[activeNumber] ?  true : false }
                        activeNumber={activeNumber}
                        optionID={element[0]}
                        answer={Object.keys(this.state.answers[activeNumber])[0]}
                        choice={this.state.choices[activeNumber]}
                        tim={tim}
                        ans={ans}
                        isCompleted={isCompleted}
                        handlePress={()=>{this.setChoice(activeNumber, element[0])}} 
                      />
                  </View>
                  )) : null}
                {/* OPTIONS ENDS HERE */}

                </View>


                <View style={{borderTopWidth: 0.5, borderTopColor:local_color.color4, flex:.5, flexDirection:'row', justifyContent:'space-between', bottom:0, margin:2, padding:2, backgroundColor: local_color.color5, borderRadius:5,}}>
                  <Icon name='arrow-back' size={40} color={local_color.color4} onPress={()=>{this.onBackward()}} />
                  <Icon name='dashboard' size={40} color={local_color.color4} onPress={()=>{this.setState({isVisible:true})}} />
                  <Icon name='spellcheck' size={40} color={local_color.color4} onPress={()=>{this.setState({isVisible:true})}} />
                  <Icon name='arrow-forward' size={40} color={local_color.color4} onPress={()=>{this.onForward()}} />
                </View>
              </View>
            </ScrollView>
            </GestureRecognizer>
              
                <ButtonGroup
                  onPress={this.updateIndex}
                  selectedIndex={selectedIndex}
                  buttons={buttons}
                  containerStyle={styles.genButtonGroup1}
                  selectedButtonStyle={styles.genButtonStyle}
                  textStyle={styles.genButtonTextStyle}
                  />
             
          </> 
        :<Activity title='Preparing Test, Please wait...' onPress={()=>{this.onPress(1)}} />}
         </View>
    </ThemeProvider>
  );
};
}

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
  test: state.testReducer,
  score: state.scoreReducer,
  user: state.userReducer
})
export default connect(mapStateToProps, { getTest, getScore, insertScore, updateScore , getScorePromise, getTestPromise })(QuestionScreen);
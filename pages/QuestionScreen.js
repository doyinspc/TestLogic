'use strict';

import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Icon, ButtonGroup  } from 'react-native-elements';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { RadioButton } from 'react-native-paper';
import * as Font from 'expo-font';

import { getTest } from './actions/Test';
import { getScore, insertScore, updateScore } from './actions/Score';

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
      noq: null,
      tim: null,
      ans: null,
      activeNumber: 1 ,
      activeIndex: 0,
      activeTime: 0,
      gestureName: 'none',
      currentTime:'',
      starttime: Math.floor(new Date().getTime()),
      selectedIndex: 2,
    };
  }

 async componentDidMount(){
   //get the test id stor in state
  let testID = '14';// this.props.navigation.getParam('testID');
  this.setState({ testID });
  //load test from test table
  this.props.getTest(testID);
  let test_data = this.props.test.test; 
  if(test_data && Object.keys(test_data).length > 0)
  {
    //set sata in state
    let settings = test_data.settings.split(':::');
    this.setState({
        ids: JSON.parse(test_data.ids),
        instructions: JSON.parse(test_data.instructions),
        questions: JSON.parse(test_data.questions),
        options: JSON.parse(test_data.options),
        answers: JSON.parse(test_data.answers),
        settime: test_data.testtime,
        noq: settings[0],
        tim: settings[1],
        ans: settings[2],
        activeNumber: JSON.parse(test_data.ids)[0]
    })
  }
  //get scoreID
  let scoreID = this.props.navigation.getParam('scoreID');
  //if the score id is set 
  if(scoreID && parseInt(scoreID) > 0)
  {
    //this is a continuation of previose test
    //load the test data
    //load past choices
    //load past time 
    this.props.getScore(scoreID, (data)=>{
     this.setState({ 
        choices: JSON.parse(data.choices), 
        timeleft: data.timeleft, 
      });
    });
    this.setState({ isRetest:true });
  }else
  {
    //this is a new test score
    //create score id
    let arr = {};
    arr['testID'] = testID;
    arr['score'] = 0;
    arr['timeleft'] = test_data.testtime;
    
    this.props.insertScore(arr, (data)=>{
      this.setState({ scoreID:data });
    });
    this.setState({ isRetest:false })
  }

  

  
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true });
  this.timer = setInterval(()=>{ this.getCurrentTime(); }, 1000);
 }


 //record the score
 setChoice=(questionID, selectionID)=>{
      let ch = {...this.state.choices};
      ch[questionID] = selectionID;
      this.setState({choices:ch});
 }

 //mark the test and record
 markTest=()=>{

  let { answers, choices, scoreID, testtime } = this.state;
  let correctAnswers = [];
  for(let i in choices){
    let d = Object.entries(answers[i]);
    if(choices[i] == d[0][0]){
       correctAnswers.push(d[0]);
    }
  };
  let score = correctAnswers.length > 0 && answers.length > 0 ? correctAnswers.length / answers.length : 0 ;
  let arr = {}
  arr['id']  = scoreID;
  arr['score']  = score;
  arr['timeleft']  = testtime;
  arr['choices']  = JSON.stringify(choices);
 // arr['answers']  = JSON.stringify(answers);
    this.props.insertScore(arr, 1, (data)=>{
  });
  //this.props.navigation.navigate('ScoreScreen', {'scoreID':scoreIDs });
}

 //swipe
 onSwipeUp=(gestureState)=> {
   //show all question numbers
  //this.setState({myText: 'You swiped up!'});
}

onSwipeDown=(gestureState)=> {
  //hid all question numbers
  //this.setState({myText: 'You swiped down!'});
}

onSwipeLeft=(gestureState)=> {
  
  this.onForward();
  
}

onSwipeRight=(gestureState)=> {
  
  this.onBackward()
  
}

onForward=()=> {
  let oldIndex = this.state.activeIndex;
  let newIndex = oldIndex + 1;
  if(newIndex < this.state.noq)
  {
    let newActiveNumber = this.state.ids[newIndex];
    this.setState({activeIndex: newIndex, activeNumber: newActiveNumber});
  }
}

onBackward=()=> {
  let oldIndex = this.state.activeIndex;
  let newIndex = oldIndex - 1;
  if(newIndex > -1)
  {
    let newActiveNumber = this.state.ids[newIndex];
    this.setState({activeIndex: newIndex, activeNumber: newActiveNumber});
  }
}

updateIndex = (selectedIndex) =>{
  this.setState({ selectedIndex });
  if(selectedIndex == 0 )
  {
      //move one question forward
      this.onBackward();
  }
  else if(selectedIndex == 1 )
  {
      //pause test save questions
      //exit to score screen
      let {choices, timeleft, scoreID } = this.state;
      //1. set up an array of items to store
      let arr = {};
      arr['choices'] = JSON.stringify(choices);
      arr['id'] = scoreID;
      arr['timeleft'] = timeleft;
      //2. get the id to store the data
      let scoreIDs = scoreID;
      //3. update the score database
      this.props.updateScore(arr, (data)=>{

      })
      //4. close this page : move to the scores page
      this.props.navigation.navigate('ScoreScreen', {'scoreID':scoreIDs });

  }
  else if(selectedIndex == 2 )
  {
      this.markTest();

  }
  else if(selectedIndex == 3 )
  {
      //move one question backwards
      this.onForward();
  }
}

onSwipe=(gestureName, gestureState)=> {
  const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
  //this.setState({gestureName: gestureName});
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
    let { settime, starttime } = this.state;
    let now = Math.floor(new Date().getTime());
    let diff = now - starttime;
    let timeLeft =  settime - Math.floor((diff/1000));
    let hours = timeLeft/(60 * 60);
    let hour = Math.floor(hours);
    let mins = (timeLeft - (hour * 60 * 60)) / 60;
    let min = Math.floor(mins);
    let sec = timeLeft - ((hour * 60 * 60) + (min * 60)) ;

  this.setState({currentTime: `${hour} : ${min} : ${sec} ` });
}

componentWillUnmount(){
  clearInterval(this.timer);
}

//componentWillMount(){
//  this.getCurrentTime();
//}

comp1 = () => <Icon name='arrow-back' type='material' />
comp2 = () => <Icon name='pause' type='material' />
comp3 = () => <Icon name='done' type='material' />
comp4 = () => <Icon name='arrow-forward' type='material' />

render(){
 const { fontLoaded, activeNumber, activeIndex, selectedIndex, ids, options, choices, questions, instructions, currentTime } = this.state;
 const buttons =[{element:this.comp1}, {element:this.comp2}, {element:this.comp3}, {element:this.comp4}];
 const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
  };
  
  let mainIDs = activeNumber;
  let mainID = mainIDs.toString();
 
 
this.getCurrentTime
  return (
    <ThemeProvider>
        {fontLoaded && ids.length > 0 ?
        <View style={{flex:1}}> 
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
               <View>
                  <Text style={styles.questionContent}>{instructions[questions[mainID][0]][1]}</Text>
                </View> 
                <View>
                  <Text style={styles.questionQuestion}>{questions[mainID][1]}</Text>
                </View> 
                <View style={{flex: 1, bottom:10, marginLeft:10, paddingTop:20}} >
                  {options[mainID]  ? 
                    options[mainID].map((element) =>(
                        <View key={`${element[0]}`} style={{flexDirection:'row'}}>
                        <RadioButton
                          value={element[0]}
                          status= {choices[activeNumber] && choices[activeNumber] == element[0] ? 'checked' : 'unchecked'}
                          onPress={() =>{this.setChoice(activeNumber, element[0])}}
                        />
                      <Text style={styles.label_radio}>{element[1]}</Text>
                      </View> 
                      
                    ))
                    : null}
                </View>
                </View>
            </ScrollView>
            </GestureRecognizer>
              
                <ButtonGroup
                  onPress={this.updateIndex}
                  selectedIndex={selectedIndex}
                  buttons={buttons}
                  containerStyle={{height:40, bottom:0}}
                  />
             
            </View>
        :<View></View>}
    </ThemeProvider>
  );
};
}

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
  test: state.testReducer,
  score: state.scoreReducer
})
export default connect(mapStateToProps, { getTest, getScore, insertScore, updateScore })(QuestionScreen);
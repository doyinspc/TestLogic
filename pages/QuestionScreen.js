'use strict';

import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemeProvider, Button, Avatar, Header, ListItem } from 'react-native-elements';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { RadioButton } from 'react-native-paper';
import * as Font from 'expo-font';


import { getQuestions } from './actions/Topic';
import { getTest } from './actions/Test';
import { getScore } from './actions/Score';

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
      activeTime:0,
      gestureName: 'none',
    };
  }

 relocate = id =>{
   this.props.navigation.navigate('TopicScreen', {id:id});
 }

 async componentDidMount(){
   //get the test id stor in state
  let testID = this.props.navigation.getParam('testID');
  this.setState({ testID });
  //load test from test table
  this.props.getTest(testID);
  let test_data = this.props.test.test;
  if(test_data && Object.keys(test_data).length > 0)
  {
    //set sata in state
    let settings = test_data.settings.split(':::');
    this.setState({
        ids: test_data.ids,
        instructions: JSON.parse(test_data.instructions),
        questions: JSON.parse(test_data.questions),
        options: JSON.parse(test_data.options),
        answers: JSON.parse(test_data.answers),
        settime: test_data.settime,
        noq: settings[0],
        tim: settings[1],
        ans: settings[2]
    })
  }
  //get scoreID
  let scoreID = this.props.navigation.getParam('scoreID');
  //if the score id is set 
  if(scoreID && parseInt(scoreID) > 0)
  {
    //this is a continuation of previose test
    //load the test data
    this.props.getScore(scoreID);
    this.setState({ isRetest:true });
  }else
  {
    //this is a new test
    //create score id
    let arr = {};
    arr['testID'] = testID;
    arr['score'] = 0;
    arr['testtime'] = test_data.settime;
    //this.props.insertScore(arr);
    this.setState({ isRetest:false })
  }

  //this.setState({ scoreID });

  
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true });
 }



 setStatex=(key, pos)=>{
      let ch = {...this.state.checks};
      ch[key] = pos;
      //this.setState({checks:ch});
 }

 //swipe
 onSwipeUp=(gestureState)=> {
  //this.setState({myText: 'You swiped up!'});
}

onSwipeDown=(gestureState)=> {
  //this.setState({myText: 'You swiped down!'});
}
''
onSwipeLeft=(gestureState)=> {
  let n = this.state.activeNumber;
  let o = n + 1;
  if(n < this.state.ids.length){
    this.setState({activeNumber:  o});
  }else{
    this.setState({activeNumber:  n});
  }
}

onSwipeRight=(gestureState)=> {
  let n = this.state.activeNumber;
  let o = n - 1;
  if(n > 0){
    this.setState({activeNumber: o})
  }
  ;
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
      //this.setState({activeNumber: this.state.activeNumber - 1});
      break;
  }
}

comp1 = () => <Icon name='pause' type='material' />
comp2 = () => <Text>Submit</Text>
comp3 = () => <Icon name='delete' type='material' />

render(){
 const { fontLoaded, activeNumber, selectedIndex } = this.state;
 const buttons =[{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];
 const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
  };

 
  return (
    <ThemeProvider>
        {fontLoaded ?
        <View> 
          <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', top:0, margin:15, padding:10, backgroundColor: local_color.color5, borderRadius:5,}}>
            <Text style={{fontFamily:'PoiretOne', fontSize:15}} >{` Question ${activeNumber}.`}</Text>
            <View style={{flexDirection:'row-reverse', justifyContent:'flex-end'}}>
                <Icon name='alarm' type='material'  />
                <Text style={{fontFamily:'PoiretOne', fontSize:15}}>{`${activeNumber}`}</Text>
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
              <View style={{flex:1, flexDirection:'column', margin:25, padding:15, justifyContent:'space-evenly', backgroundColor: local_color.color5, borderRadius:15}}>
               <View>
                <Text>{this.state.instructions[activeNumber]}</Text>
               </View>
                <View>
                <Text style={styles.questionQuestion}>{this.state.questions[activeNumber]}</Text>
                </View> 
                <View style={{flex: 1, bottom:5, marginLeft:10, paddingTop:20}} >
                  {
                    this.state.options[this.state.activeNumber].map((ele, id) =>(
                        <View key={`xx${id}`} style={{flexDirection:'row'}}>
                        <RadioButton
                          value={id}
                          status='unchecked'
                          onPress={() =>{this.setStatex(ele.id)}}
                        />
                      <Text style={styles.label_radio}>{ele}</Text>
                      </View>
                      
                    ))
                  }
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
export default connect(mapStateToProps, { getTest, getScore })(QuestionScreen);
import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { ThemeProvider, Icon, PricingCard, ButtonGroup } from 'react-native-elements';


import * as Font from 'expo-font';
import Activity from './components/LoaderTest';

import { getTest, getTestPromise  } from './actions/Test';
import { getScore, getScorePromise  } from './actions/Score';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;


// Your App
class ScoresScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      scoreID: null,
      testID:null,
      score:{},
      test:{},
      selectedIndex:null,
    };
  }

  relocate = (value) =>{
    if(value && value > 0)
    {
     this.props.navigation.navigate('ScoreScreen', {'scoreID':value})
    }
  }

  timeLefts = (timeLeft) =>{
    let hours = timeLeft/(60 * 60);
    let hour = Math.floor(hours);
    let mins = (timeLeft - (hour * 60 * 60)) / 60;
    let min = Math.floor(mins);
    let sec = timeLeft - ((hour * 60 * 60) + (min * 60)) ;
    hour = hour > 0 ? hour : '--';
    min = min > 0 ? min : '--';
    sec = sec > 0 ? sec : '--';
    return `${hour.toString().padStart(2, '0')} hrs : ${min.toString().padStart(2, '0')} mins : ${sec.toString().padStart(2, '0')} secs` ;
}
 
  async componentDidMount() {
    this.props.getScore(JSON.stringify(this.props.navigation.getParam('scoreID')));
    this.props.getTest(JSON.stringify(this.props.navigation.getParam('testID')));
    let scoreID = this.props.navigation.getParam('scoreID');
    let testID = this.props.navigation.getParam('testID');

    this.props.getTestPromise(testID)
      .then(test_data =>{this.setState({test: test_data})})
      .catch(err=>{Alert.alert('Error', JSON.stringify(err));})
    this.props.getScorePromise(scoreID)
      .then(score_data =>{this.setState({score: score_data})})
      .catch(err=>{Alert.alert('Error', 'score'+scoreID+JSON.stringify(err));})

    this.setState({testID:testID, scoreID:scoreID})
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true, scoreID, testID });
  }



  componentWillUnmount() {
    clearInterval(this.state);
    this.setState({
      fontLoaded: false,
      scoreID: null,
      testID:null,
      score:{},
      test:{},
      selectedIndex:null,
    });
  }

  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });
    if(selectedIndex == 0 )
    {
        this.props.navigation.navigate('HomeScreen');
    }
    else if(selectedIndex == 1 )
    {
        this.props.navigation.navigate('ScoresScreen', {'testID':this.state.testID});
    }
    else if(selectedIndex == 2 )
    {
        this.props.navigation.navigate('TestSheetScreen', {'testID':this.state.testID });
    }
  }
  
  comp1 = () => <Icon name='home' color='white' type='material' />
  comp2 = () => <Icon name='list' color='white' type='material' />
  comp3 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Retake</Text>

render(){
 const { fontLoaded, selectedIndex, score, test  } = this.state;
 const buttons = [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];

  let correctAnswers = [];
  let emptyAnswers = [];
  let wrongAnswers = [];
  let noq = 0;
  let final_score = 0;
  let q_answered = 0;
  let q_unanswered = 0;
  let tim ='No Time';
  let sco = score !== undefined && score.timespent !== undefined && score.timespent !== 'null'  && Array.isArray(Object.values(JSON.parse(score.timespent))) && Object.values(JSON.parse(score.timespent)).length > 0 ? Object.values(JSON.parse(score.timespent)) : [];
  
  if(test)
  {
    let choices = score !== undefined && score.choices !== undefined ? JSON.parse(score.choices) : {};
    let answers = test !== undefined && test.answers !== undefined ? JSON.parse(test.answers) : {};
    noq = test !== undefined ?  Object.keys(answers).length : 0;
    final_score = score !== undefined ? score.score * 100: 0;
    tim = score !== undefined && sco !== undefined && sco !== 'null'  && Array.isArray(Object.values(sco)) && Object.values(sco).length > 0 ? Object.values(sco).map(Number).reduce(function(a, b){return a + b}, 0) : 'No Time';

  if(final_score > 0)
  {
    for(let i in answers)
    {
      let d = Object.keys(answers[i])[0];
      if(choices[i] == d){
        correctAnswers.push(d);
      }
      else if(choices[i] && choices[i] != undefined && choices[i] != d)
      {
        wrongAnswers.push(d);
      }else
      {
        emptyAnswers.push(1);
      } 
    };  
  }else
  {
    q_answered = Object.keys(choices).length > 0 ? Object.keys(choices).length: 0 ;
    q_unanswered = noq - q_answered;
  }
  
}
   let but_title = ` Continue`;
  let info = [];
  if(final_score > 0)
  {
    info = [
      `${noq} questions `,
      `${correctAnswers.length} questions passed`, 
      `${wrongAnswers.length} questions failed`, 
      `${this.timeLefts(tim)} spent`, 
    ];

  }else{
    info = [
      `${noq} questions `,
      `${q_answered} answered ${q_unanswered} unanswered ${emptyAnswers.length} left`,
      `${q_unanswered} left`, 
      `${this.timeLefts(tim)} spent`,
    ];

  }
  
  return (
    <ThemeProvider >
      <View style={{flex:1}}>
       {fontLoaded && test.title && test.title != undefined && final_score >= 0 ? 
        final_score > 0 ?
        <View style={{flex: 1, justifyContent:'center'}}>
            <PricingCard
            color={local_color.color3}
            title={`${test.title}`}
            titleFont = "SulphurPointNormal"
            priceFont = "PoiretOne"
            price= {`${Math.round(final_score, 1)}%`}
            titleStyle={{fontFamily:'SulphurPointNormal'}}
            font={'SulphurPointNormal'}
            info={info}
            infoStyle={{fontFamily:'SulphurPointNormal'}}
            button={{ title: ' View Performance ', icon:'done-all' }}
            onButtonPress={()=>this.props.navigation.navigate('QuestionScreen', {'testID':this.state.testID, 'scoreID':this.state.scoreID }) }
            />
        </View>
     :
        <View style={{flex: 1, justifyContent:'center'}}>
           <PricingCard
            color={local_color.color4}
            title={`${test.title}`}
            titleFont = "SulphurPointNormal"
            pricingFont = "PoiretOne"
            price= {`${Math.round(final_score, 1)}%`}
            titleStyle={{fontFamily:'SulphurPointNormal'}}
            info={info}
            infoStyle={{fontFamily:'SulphurPointNormal'}}
            button={{ title: but_title, icon:'pause' }}
            onButtonPress={()=>this.props.navigation.navigate('QuestionScreen', {'testID':this.state.testID, 'scoreID':this.state.scoreID}) }
            />
        </View>:
        <Activity title='Scores' onPress={()=>{this.onPress(1)}} /> 
        }  
        <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={styles.genButtonGroup}
            selectedButtonStyle={styles.genButtonStyle}
            textStyle={styles.genButtonTextStyle}
            />
      </View>
    </ThemeProvider>
  );
};
}

const styles = StyleSheet.create(local_style)

const mapStateToProps = state => ({ 
  score: state.scoreReducer,
  test: state.testReducer,
  user: state.userReducer
})
export default connect(mapStateToProps,{ getTest, getScore, getTestPromise, getScorePromise })(ScoresScreen);
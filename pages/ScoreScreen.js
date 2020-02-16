import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Icon, PricingCard, ButtonGroup } from 'react-native-elements';


import * as Font from 'expo-font';
import Activity from './components/LoaderTest';

import { getTest,  } from './actions/Test';
import { getScore,  } from './actions/Score';

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
      selectedIndex:null,
    };
  }

  relocate = (value) =>{
    if(value && value > 0)
    {
     this.props.navigation.navigate('ScoreScreen', {'scoreID':value})
    }
  }
 
  async componentDidMount() {
    this.props.getScore(JSON.stringify(this.props.navigation.getParam('scoreID')));
    this.props.getTest(JSON.stringify(this.props.navigation.getParam('testID')));
    let scoreID = JSON.stringify(this.props.navigation.getParam('scoreID'));
    let testID = JSON.stringify(this.props.navigation.getParam('testID'));
    this.setState({testID:testID, scoreID:scoreID})
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
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
  comp3 = () => <Icon name='refresh' color='white' type='material' />

render(){
 const { test, score } = this.props;
 const { fontLoaded, selectedIndex, testID, scoreID  } = this.state;
 const buttons = [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];

  let correctAnswers = [];
  let emptyAnswers = [];
  let wrongAnswers = [];
  let noq = 0;
  let final_score = 0;
  let q_answered = 0;
  let q_unanswered = 0;
  if(!this.props.test.isLoading && !this.props.score.isLoading)
  {
  let choices = this.props.score.score !== undefined && this.props.score.score.choices !== undefined ? JSON.parse(this.props.score.score.choices) : {};
  let answers = this.props.test.test !== undefined && this.props.test.test.answers !== undefined ? JSON.parse(this.props.test.test.answers):{};
  noq = this.props.test.test !== undefined ?  Object.keys(answers).length : 0;
  final_score = this.props.score.score !== undefined ? this.props.score.score.score * 100: 0;
 
  
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
      `${emptyAnswers.length} questions unanswered`, 
    ];

  }else{
    info = [
      `${noq} questions `,
      `${q_answered} questions answered`,
      `${q_unanswered} questions unanswered`, 
      `${emptyAnswers.length} minutes left`,
    ];

  }
  
  return (
    <ThemeProvider >
      <View style={{flex:1}}>
       {fontLoaded && !test.isLoading && !score.isLoading ? 
        final_score > 0 ?
        <View style={{flex: 1, justifyContent:'center'}}>
            <PricingCard
            color={local_color.color3}
            title={`${test.test.title}`}
            titleFont = "SulphurPointNormal"
            pricingFont = "PoiretOne"
            price= {`${final_score}%`}
            titleStyle={{fontFamily:'SulphurPointNormal'}}
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
            title={`${test.test.title}`}
            titleFont = "SulphurPointNormal"
            pricingFont = "PoiretOne"
            price= {`${final_score}%`}
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
export default connect(mapStateToProps,{ getTest, getScore })(ScoresScreen);
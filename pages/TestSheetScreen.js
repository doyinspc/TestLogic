import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Button, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import Activity from './components/Loader';

import { getTest } from './actions/Test';
import { getScores } from './actions/Score'; 
let datab =[
  {
    'id': 1,
    'name':'Show answers immediately' 
  },
  {
    'id': 2,
    'name':'Show answers at the end of the test' 
  },
  {
    'id': 3,
    'name':'Do not show answers' 
  }
]

let dataxb =[
  {
    'id': 1,
    'name':'Set time for all questions' 
  },
  {
    'id': 2,
    'name':'Set time per question' 
  },
  {
    'id': 3,
    'name':'No timer' 
  }
]


const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;


// Your App
class ScoresScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      testID: null,
      subjectID: null,
      fontLoaded: false,
      tableHead : ['Title', 'Description'],
      tableData : [],
      selectedIndex : null,
      currentTime : null,
      futureTime : null,
      hours:null,
      minutes:null,
      seconds:null,
      timeSetting: null,
      answerSetting: null,
      maxScore: 0,
      testQuantity:0,
      description: null,
      isVisible:false,
    };
  }

  relocate = () =>{
    let value = this.state.testID;
    if(value && value > 0)
    {
     this.props.navigation.navigate('ScoresScreen', {'testID':value})
    }
  }
 
  async componentDidMount() {
    this.props.getTest(JSON.stringify(this.props.navigation.getParam('testID')));
    this.setState({testID:this.props.navigation.getParam('testID')})
    let test_data = this.props.test.test;
    let isLoading = this.props.test.isLoading;
    if(!isLoading && test_data && Object.keys(test_data).length > 0)
    {
        let test_array = [];
        let hours = test_data.testtime/(60 * 60);
        let hour = Math.floor(hours);
        let mins = (test_data.testtime - (hour * 60 * 60)) / 60;
        let min = Math.floor(mins);
        let sec = test_data.testtime - ((hour * 60 * 60) + (min * 60)) ;
        let settings = test_data.settings?  test_data.settings.split(':::'): [0, 0, 0];
        let timer_arr = dataxb.filter(a => a.id == settings[1])[0];
        let answ_arr = datab.filter(a => a.id == settings[2])[0];
        this.setState({ hours: hour, minutes:min, seconds:sec });

        test_array[0] = ['Title', test_data.title];
        test_array[1] = ['N.O.Q.', settings[0]];
        test_array[2] = ['Duration', `${hour}hrs:${min}mins:${sec}sec`];
        test_array[3] = ['Time', test_data.testtime];
        test_array[4] = ['Trials', this.state.testQuantity];
        test_array[5] = ['Max. Score', this.state.maxScore];
        test_array[6] = ['Date', test_data.created_at];
        test_array[7] = ['Timer', timer_arr.name];
        test_array[8] = ['Answer', answ_arr.name];

        let newTableData = [...this.state.tableData];
        newTableData = test_array;
        this.setState({ tableData: newTableData, timeSetting:settings[1], description:test_data.description });
    }
    this.setState({ testID: this.props.navigation.getParam('testID'), subjectID:test_data.subjectID});
    this.props.getScores(this.props.navigation.getParam('testID'));
    let testQuantity = 0;
    let maxScore = 0;
    if(!this.props.score.isLoading)
    {
      let scores = this.props.score.scores;
      if(scores && Array.isArray(scores) && scores.length > 0 ){
         testQuantity = scores.length;
         let maxScoreArray = [];
         scores.forEach((row)=>{
               maxScoreArray.push(row.score);
         })
         maxScore = Math.max(...maxScoreArray) * 100;
         
      }
      this.setState({maxScore, testQuantity})

    }
    await Font.loadAsync({
      'PoiretOne': require("../assets/fonts/PoiretOne-Regular.ttf"),
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
   
    this.setState({ fontLoaded: true });
    this.timer = setInterval(()=>{ this.getCurrentTime(); }, 1000);
    this.timerx = setInterval(()=>{ this.getFutureTime(); }, 1000);
  }
  getCurrentTime = () =>{
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    this.setState({currentTime: `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} ` });
  }
  getFutureTime = () =>{
    let {hours, minutes, seconds } = this.state;
    let additional= ((hours * 60 * 60 ) + (minutes * 60 ) + seconds) * 1000;
    let newTime =  Math.floor(new Date().getTime() ) + additional;
    
    let tdate = new Date();
    tdate.setTime(newTime);
    this.setState({futureTime: `${tdate.getHours().toString().padStart(2, '0')} : ${tdate.getMinutes().toString().padStart(2, '0')} ` });
  }
  componentWillUnmount(){
    clearInterval(this.timer);
    clearInterval(this.timerx);
    this.setState({
      testID: null,
      subjectID: null,
      fontLoaded: false,
      tableHead : ['Title', 'Description'],
      tableData : [],
      selectedIndex : null,
      currentTime : null,
      futureTime : null,
      hours:null,
      minutes:null,
      seconds:null,
      timeSetting: null,
      answerSetting: null,
      maxScore: 0,
      testQuantity:0,
      description: null,
      isVisible:false,
    })
  }
  deleteTest= () =>{
    //delete action
  }
  relocate=()=>{
    this.props.navigation.navigate('QuestionScreen', {'testID':this.state.testID, 'scoreID':null })
  }

  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });
    let testID = this.state.testID;
    if(selectedIndex == 0 && testID && testID > 0)
    {
        this.props.navigation.navigate('TestSettingsScreen', {'topics':null, 'testID':testID});
    }
    else if(selectedIndex == 1 && testID && testID > 0)
    {
        //delete test
        this.deleteTest();
    }
    else if(selectedIndex == 2 && testID && testID > 0)
    {
      //delete test
      this.props.navigation.navigate('ScoresScreen', {'testID':testID });
    }
  }

comp1 = () => <Icon name='edit' color='white' type='material' />
comp2 = () => <Icon name='delete' color='white' type='material' />
comp3 = () => <Icon name='list'color='white' type='material' />

render(){
 const { themes } = this.props.theme;
 const { topics } = this.props.topic;
 const { name } = this.props.subject.subject;
 const { fontLoaded, selectedIndex, test } = this.state;

 this.getCurrentTime;
 this.getFutureTime;
 let time_shared = 0;

  let title = '';
  let description = '';
  let hour = 0;
  let min = 0;
  let sec = 0;
  let noq = 0;
  let settings = [];
  let timer_arr = '';
  let answ_arr = '';
  let testQuantity = 0;
  let maxScore = 0;
  let test_data = this.props.test.test;
  let timeSetting = 1;
  let topic = [];

    if(test_data && Object.keys(test_data).length > 0){
       
        settings = test_data.settings?  test_data.settings.split(':::'): [0, 0, 0];
        noq = settings[0];
        timeSetting = settings[1];
        timer_arr = dataxb.filter(a => a.id == settings[1])[0];
        answ_arr = datab.filter(a => a.id == settings[2])[0];
        title = test_data.title;
        description = test_data.description;
        topic = test_data.topics ? JSON.parse(test_data.topics): [];
        let hours = 0;
        let mins = 0;
        if(parseInt(settings[1]) === 1)
        {
          hours = test_data.testtime/(60 * 60);
          hour = Math.floor(hours);
          mins = (test_data.testtime - (hour * 60 * 60)) / 60;
          min = Math.floor(mins);
          sec = test_data.testtime - ((hour * 60 * 60) + (min * 60)) ;
        }
        if(parseInt(settings[1]) === 2)
        {
          let ttime = test_data.testtime * noq;
          hours = ttime/(60 * 60);
          hour = Math.floor(hours);
          mins = (ttime - (hour * 60 * 60)) / 60;
          min = Math.floor(mins);
          sec = ttime - ((hour * 60 * 60) + (min * 60)) ;
          time_shared = `${parseInt(test_data.testtime)} sec. `;
        }
        if(parseInt(settings[1]) === 3)
        {
          hour = 0;
          min = 0;
          sec = 0;
        }
       
    }
 
    
    if(!this.props.score.isLoading)
    {
      let scores = this.props.score.scores;
      if(scores && Array.isArray(scores) && scores.length > 0 )
      {
         testQuantity = scores.length;
         let maxScoreArray = [];
         scores.forEach((row)=>{
               maxScoreArray.push(row.score);
         })
         maxScore = Math.max(...maxScoreArray) * 100;
      }
    }
    const buttons = testQuantity > 0 ? [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}] : [{element:this.comp1},  {element:this.comp2}];
    const list_topics = topics && Array.isArray(topics) && topics.length > 0 && topic ? topics.filter((row)=>topic.includes(row.id)) : null;
    const list_data_topics = list_topics && Array.isArray(list_topics) && list_topics.length > 0 ? list_topics.map(row =>(<Text key={`${row.id}xx`} style={{ color:'black', fontFamily:'PoiretOne', marginTop:2}}>{row.name}</Text>)) :null;
  
    const list_topics_filter_themes = [];
    list_topics && Array.isArray(list_topics) && list_topics.length > 0 ? list_topics.map((row) =>list_topics_filter_themes.push(row.themeID)) : null;
    const list_themes = themes && Array.isArray(themes) && themes.length > 0 && list_topics_filter_themes  ? themes.filter((row)=>list_topics_filter_themes.includes(row.id)) : null;
    const list_data = list_themes && Array.isArray(list_themes) && list_themes.length > 0 ? list_themes.map(row =>(<Text style={{ color:'black', fontFamily:'PoiretOne', marginTop:2}} key={row.id}>{row.name}</Text>)) : null;
   
 let state = this.state;
  return (
    <ThemeProvider>
      <View style={styles.topSection_small}>
          <Text style={styles.h1}>{name}</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
                  <Icon reverse raised name='home' type='material' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}} />
                  <Icon reverse raised name='ios-list' type='ionicon' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('TestScreen', {'subjectID': this.state.subjectID})}} />
                  <Icon reverse raised name='md-help' type='ionicon' color={local_color.color_icon} onPress={()=>{this.changeVisibility()}}/>
          </View>
      </View>
       {fontLoaded?  
        <View style={{margins:0,  flex: 1, flexDirection:'column', justifyContent:'space-between'}}>
         <View style={styles.table_container}>
         <ScrollView>
          <View style={{flexDirection:'column', flexWrap:'wrap', margin:0, padding:10, justifyContent:'center', alignContent:'center'}}>
              <View style={styles.row_sheet} >
                <Text style={styles.h2_sheet}>Title</Text><Text style={styles.h2_sheets}>{title}</Text>
              </View>
              <View style={styles.row_sheet} >
                <Text style={styles.h2_sheet}>Number of Questions</Text><Text style={styles.h2_sheets}>{noq}</Text>
              </View>
              <View style={styles.row_sheet} >
                <Text style={styles.h2_sheet}>Duration of Test</Text><Text style={styles.h2_sheets}>{`${hour}hrs:${min}mins:${sec}sec`}</Text>
              </View>
              <View style={styles.row_sheet} >
                <Text style={styles.h2_sheet}>Time in seconds</Text><Text style={styles.h2_sheets}>{name}</Text>
              </View>
              <View style={styles.row_sheet} >
                <Text style={styles.h2_sheet}>Number of Attempts</Text><Text style={styles.h2_sheets}>{testQuantity}</Text>
              </View>
              <View style={styles.row_sheet} >
                <Text style={styles.h2_sheet}>Maximum score obtained</Text><Text style={styles.h2_sheets}>{Math.round(maxScore, 1)}</Text>
              </View>
              <View style={styles.col_sheet} >
                <Text style={styles.h2_sheet}>Timer Preference</Text>
                <View style={styles.col_sheet}><Text style={[styles.h2_sheets, {color:'red'}] }>{timer_arr.name}</Text></View>
              </View>
              <View style={styles.col_sheet} >
                <Text style={styles.h2_sheet}>Answer Preference</Text>
                <View style={[styles.col_sheet, {flex:1}]}><Text style={[styles.h2_sheets, {color:'red'}]}>{answ_arr.name}</Text></View>
              </View>
              <View style={styles.col_sheet} >
                <Text style={styles.h2_sheet}>Description</Text><Text style={styles.h2_sheets}>{description}</Text>
              </View>
              <View style={styles.col_sheet} >
                <Text style={styles.h2_sheet}>Themes</Text><View style={styles.col_sheet}>{list_data}</View>
              </View>
              <View style={styles.col_sheet} >
                <Text style={styles.h2_sheet}>Topics</Text>{list_data_topics}
              </View>
            </View>
        </ScrollView>
       
        </View>
        
             { timeSetting == 1 ?
              <View style={{  flexDirection:'row', margin:10, padding:10,  justifyContent:'center' }}>
                  <Text style={styles.timers}>{this.state.currentTime}</Text>
                  <Text style={styles.timers}>{' - '}</Text>
                  <Text style={styles.timers}>{this.state.futureTime}</Text>
              </View>
             : null 
             }
             { timeSetting == 2 ?
              <View style={{  flexDirection:'row', margin:10, padding:10,  justifyContent:'center' }}>
                    <Text style={styles.timers}>{`${time_shared} for each questions`}</Text>
              </View>
             : null 
             }
             { timeSetting == 3 ?
              <View style={{  flexDirection:'row', margin:10, padding:10,  justifyContent:'center' }}>
                  <Text style={styles.timers}>--.--.--  - --.--.--</Text>
              </View>
             : null 
             }

        
        
          <Button 
            large
            icon={{name: 'done-all', height:45, type: 'material', color:'#fff' }}
            title='START TEST'
            buttonStyle={{backgroundColor:local_color.color3, bottom:1, margin:10, padding:10, justifyContent:'center'}}
            onPress={this.relocate}
          />
          
          </View>
          :
          <View style={{ minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, bottom:0, alignContent:'center'}}>
          <Icon name='home' type='material' size={70} color={local_color.color1} />
          <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Please select a test.</Text>
         </View> 
          }
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={styles.genButtonGroup}
            selectedButtonStyle={styles.genButtonStyle}
            textStyle={styles.genButtonTextStyle}
            />
  
           
    </ThemeProvider>
  );
};
}

const styles = StyleSheet.create(local_style)

const mapStateToProps = state => ({ 
  subject: state.subjectReducer,
  theme: state.themeReducer,
  topic: state.topicReducer,
  test: state.testReducer,
  score: state.scoreReducer,
  user: state.userReducer
})
export default connect(mapStateToProps,{ getTest, getScores})(ScoresScreen);
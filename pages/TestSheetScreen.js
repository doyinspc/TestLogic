import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Button, Avatar, ListItem, ButtonGroup, Icon } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import * as Font from 'expo-font';
import Activity from './components/Loader';

import { getTest } from './actions/Test';
import { getScores } from './actions/Score'; 

const datab = [
  {
    'id': 1,
    'name':'Show answers immediately after selection' 
  },
  {
    'id': 2,
    'name':'Show answers at the end of the test' 
  },
  {
    'id': 3,
    'name':'Do not show any answers' 
  }
]


const dataxb =[
  {
    'id': 1,
    'name':'Time set for all questions' 
  },
  {
    'id': 2,
    'name':'Distrubute time equally per question' 
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
    if(!isLoading && test_data && Object.keys(test_data).length > 0){
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
    this.setState({ testID: this.props.navigation.getParam('testID')});
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

    this.setState({currentTime: `${hours} : ${minutes} ` });
  }
  getFutureTime = () =>{
    let {hours, minutes, seconds } = this.state;
    let additional= ((hours * 60 * 60 ) + (minutes * 60 ) + seconds) * 1000;
    let newTime =  Math.floor(new Date().getTime() ) + additional;
    
    let tdate = new Date();
    tdate.setTime(newTime);
    this.setState({futureTime: `${tdate.getHours()} : ${tdate.getMinutes()} ` });
  }

  componentWillUnmount(){
    clearInterval(this.timer);
    clearInterval(this.timerx);
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
      if(this.state.testQuantity > 0 && testID && testID > 0){
        this.props.navigation.navigate('ScoresScreen', {'testID':testID });
      }
      else
      {   
        //delete test
            this.deleteTest();
      }
        
    }
    else if(selectedIndex == 2 && testID && testID > 0)
    {
      //delete test
        this.deleteTest();
    }
  }

comp1 = () => <Icon name='edit' color='white' type='material' />
comp2 = () => <Icon name='book'color='white' type='material' />
comp3 = () => <Icon name='delete' color='white' type='material' />

render(){
  
 
 const { test, score, isLoading } = this.props;
 const { fontLoaded, selectedIndex,  timeSetting, testQuantity, description } = this.state;
 const buttons = testQuantity > 0 ? [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}] : [{element:this.comp1},  {element:this.comp3}];

 this.getCurrentTime;
 this.getFutureTime;
 let time_shared = 0;

 let state = this.state;
  return (
    <ThemeProvider>
       {fontLoaded && !isLoading ?  
        <View style={{margins:0,  flex: 1, flexDirection:'column', justifyContent:'space-between'}}>
         <View style={styles.table_container}>
            <Table borderStyle={{borderWidth: 1}}>
            <Row data={state.tableHead} flexArr={[1, 2]} style={styles.table_head} textStyle={styles.table_text_white}/>
            <TableWrapper style={styles.table_wrapper}>
                <Col data={state.tableTitle} style={styles.table_title} heightArr={[28,28]} textStyle={styles.table_text}/>
                <Rows data={state.tableData} flexArr={[1, 2]} style={styles.table_row} textStyle={styles.table_text}/>
            </TableWrapper>
            </Table>
       <Text style={{fontFamily:'SulphurPoint', marginTop:15, textAlign:'left'}}>{description ? description : 'No desciption just testing the dorr. my current psychological space you a re we track down the lady that got your name' }</Text>
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
  test: state.testReducer,
  score: state.scoreReducer
})
export default connect(mapStateToProps,{ getTest, getScores})(ScoresScreen);
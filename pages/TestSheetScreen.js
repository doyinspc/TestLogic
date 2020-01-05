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
      selectedIndex : 1,
      currentTime : null,
      futureTime : null,
      hours:null,
      minutes:null,
      seconds:null,
      timeSetting: null,
      answerSetting: null,
    };
  }

 

  relocate = () =>{
    let value = this.state.testID;
    if(value && value > 0)
    {
     this.props.navigation.navigate('ScoresScreen', {val:value})
    }
  }
 
  async componentDidMount() {
    this.props.getTest(JSON.stringify(this.props.navigation.getParam('testID')));
    let test_data = this.props.test.test;
    let isLoading = this.props.test.isLoading;
    if(!isLoading && test_data && Object.keys(test_data).length > 0){
        let test_array = [];
        let hours = test_data.testtime/(60 * 60);
        let hour = Math.floor(hours);
        let mins = (test_data.testtime - (hour * 60 * 60)) / 60;
        let min = Math.floor(mins);
        let sec = test_data.testtime - ((hour * 60 * 60) + (min * 60)) ;
        let settings = test_data.settings.split(':::');
        let timer_arr = dataxb.filter(a => a.id == settings[1])[0];
        let answ_arr = datab.filter(a => a.id == settings[2])[0];
        this.setState({ hours: hour, minutes:min, seconds:sec });

        test_array[0] = ['Title', test_data.title];
        test_array[1] = ['N.O.Q.', settings[0]];
        test_array[2] = ['Duration', `${hour}hrs:${min}mins:${sec}sec`];
        test_array[3] = ['Time', test_data.testtime];
        test_array[4] = ['Trials', test_data.testtime];
        test_array[5] = ['Max. Score', test_data.testtime];
        test_array[6] = ['Date', test_data.testtime];
        test_array[7] = ['Timer', timer_arr.name];
        test_array[8] = ['Answer', answ_arr.name];
        test_array[9] = ['Description', test_data.description];

        let newTableData = [...this.state.tableData];
        newTableData = test_array;
        this.setState({ tableData: newTableData, timeSetting:settings[1] });
    }
    this.setState({ testID: this.props.navigation.getParam('testID')});
    this.props.getScores(this.props.navigation.getParam('testID'));
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

  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });
    let testID = this.state.testID;
    if(selectedIndex == 0 && testID && testID > 0)
    {
        this.props.navigation.navigate('TestSettingsScreen', {'topics':null, 'testID':testID});
    }
    else if(selectedIndex == 1 && testID && testID > 0)
    {
        this.props.navigation.navigate('ScoreListScreen', {'testID':testID });
    }
    else if(selectedIndex == 2 && testID && testID > 0)
    {
      //delete

    }
  }

comp1 = () => <Icon name='edit' type='material' />
comp2 = () => <Icon name='book' type='material' />
comp3 = () => <Icon name='delete' type='material' />

render(){
  
 
 const { test, score, isLoading } = this.props;
 const { fontLoaded, selectedIndex,  timeSetting } = this.state;
 const buttons =[{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];

 this.getCurrentTime;
 this.getFutureTime;

 let state = this.state;
  return (
    <ThemeProvider>
       {!fontLoaded && isLoading ?  
        <Activity title='Scores' onPress={()=>{this.onPress(1)}} />:
        <View style={{margins:0,  flex: 1, flexDirection:'column', justifyContent:'space-between'}}>
         <View style={styles.table_container}>
            <Table borderStyle={{borderWidth: 1}}>
            <Row data={state.tableHead} flexArr={[1, 2]} style={styles.table_head} textStyle={styles.table_text}/>
            <TableWrapper style={styles.table_wrapper}>
                <Col data={state.tableTitle} style={styles.table_title} heightArr={[28,28]} textStyle={styles.table_text}/>
                <Rows data={state.tableData} flexArr={[1, 2]} style={styles.table_row} textStyle={styles.table_text}/>
            </TableWrapper>
            </Table>
        </View>
        <View style={{flex: 10}}>
          <ScrollView>
            { 
            score.scores  && Object.keys(score.scores) > 0 ? score.scores.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocate(l.id)}}
                badge={{  value: l.score, textStyle: { color: 'white', backgroundColor:local_color.MAIN, borderRadius:20 }, containerStyle: { marginTop: 1 } }}
            />
            ))
            : null}
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
                  <Text style={styles.timers}>--.--.--  - --.--.--</Text>
              </View>
             : null 
             }

         <View style={{margin:0, padding:0, bottom:0, justifyContent:'space-between' }}>
         <View style={{margin:30, padding:20, bottom:0, justifyContent:'center' }}>
          <Button 
            large
            icon={{name: 'dashboard', type: 'material', color:'#fff' }}
            title='START TEST' 
            onPress={this.relocate}
          />
          </View>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{height:40}}
            />
         </View>
        </View> }  
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
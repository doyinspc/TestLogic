import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import { FlatList } from 'react-native-gesture-handler';

import { getScores } from './actions/Score';
import { getTest } from './actions/Test';
import Activity from './components/LoaderTest';
import Admob from "./advert/Admob";
import Adinter from "./advert/Adinter";

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
      selectedIndex: null,
      testID:null,
      noq: 0,
      title: '',
      tim:0,
      scores:this.props.scores
    };
  }

  relocate = (testID, scoreID) =>{
     this.props.navigation.navigate('ScoreScreen', {'testID':testID, 'scoreID':scoreID});
  }
 
  async componentDidMount() {
    this.props.getTest(this.props.navigation.getParam('testID'));
    this.props.getScores(this.props.navigation.getParam('testID'));

    if(Object.keys(this.props.test.test).length > 0 )
    {
      let test_data =  this.props.test.test;
      let settings = test_data.settings.split(":::");
      this.setState({title:test_data.title, noq:settings[0], tim:settings[1]})
    }

    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true, testID:this.props.navigation.getParam('testID') });
  }

  timeLefts = (ty, tin) =>{
      let ti = JSON.parse(tin);
      if(ti && Object.keys(ti).length > 0)
      {
        let val = Object.values(ti);
        let sumLeft = val.reduce((a, b)=> a + b, 0);
        let timeGiven = 0;
        let timeleft = sumLeft;
        let mins = Math.floor(timeleft/60);
        let secs = timeleft - (mins * 60);
        return `${mins}m ${secs}s`
      }else{
        return `--.--`;
      }
  }


  uploadScore =()=>{
    //this.props.getSubjectsCloud();
  }
  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });
    if(selectedIndex == 0 )
    {
        this.props.navigation.navigate('HomeScreen');
    }
    else if(selectedIndex == 1 )
    {
        this.uploadScore()
    }
    else if(selectedIndex == 2 )
    {
        this.downloadScore()
    }
    else if(selectedIndex == 3 )
    {
      this.props.navigation.navigate('TestSheetScreen', {'testID':this.state.testID, 'scoreID': null});
    }
   
  }
  
  comp1 = () => <Icon name='home' color='white' type='material' />
  comp2 = () => <Icon name='cloud-upload' color='white' type='material' />
  comp3 = () => <Icon name='cloud-download' color='white' type='material' />
  comp4 = () => <Icon name='refresh' color='white' type='material' />
   //USE WHEN ACADEMIC
  keyExtractors = (item, index) =>index.toString();
  renderItems = ({item, index}) =>
          <ListItem
          key={index}
          titleStyle={styles.listItem}  
          leftAvatar={ 
            (item.score * 100) == 0 ? 
                  <Avatar overlayContainerStyle={{backgroundColor: local_color.color4}} activeOpacity={0.7}  rounded  icon={{ name: 'pause', color:local_color.color1, backgroundColor:'red' }} /> 
                  : (item.score * 100) < 60 ? 
                      <Avatar overlayContainerStyle={{backgroundColor: 'red'}} activeOpacity={0.7}  rounded  icon={{ name: 'delete', color:'white', backgroundColor:'red' }} />
                      : (item.score * 100) >= 60  && (item.score * 100) < 80 ?  <Avatar overlayContainerStyle={{backgroundColor: 'blue'}} activeOpacity={0.7}  rounded  icon={{ name: 'done', color:'white', backgroundColor:'red' }} />
                        : <Avatar overlayContainerStyle={{backgroundColor:local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: 'done-all', color:'white', backgroundColor:'red' }} />
        }
          title={item.created_at+' '+item.id}
          rightTitle={`${Math.floor(item.score * 100)}%`}
          subtitle={`${this.state.noq && this.state.noq > 0 && Object.keys(JSON.parse(item.choices)).length > 0 ? Math.floor(((Object.keys(JSON.parse(item.choices)).length/this.state.noq) * 100))  : 0 }% completed`}
          titleStyle={styles.listItem}
          rightTitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color2}} 
          subtitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color4}} 
          rightSubtitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color4}}
          rightSubtitle={`${this.timeLefts(item.timeleft, item.timespent)}`}
          bottomDivider
          friction={90}
          tension={100}
          activeScale={0.85}
          onPress={()=>{this.relocate(this.state.testID, item.id)}}
          chevron
        />
  renderItemsx = ({l, i}) =><Text>{i.id}</Text>

render(){

 const { isLoading, scores } = this.props.score;
 const { name } = this.props.subject.subject;
 const { test } = this.props.test;
 const { fontLoaded, selectedIndex, testID, noq } = this.state;
 const buttons = [{element:this.comp1}, {element:this.comp2} , {element:this.comp3} , {element:this.comp4}];
  return (
    <ThemeProvider >
        <View style={styles.topSection}>
          <Text style={styles.h1}>{name}</Text>
          <Text style={styles.h2}>{test.title}</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
                  <Icon reverse raised name='home' type='material' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}} />
                  <Icon reverse raised name='ios-list' type='ionicon' color='#517fa4' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('TestSheetScreen',{'testID':this.props.navigation.getParam('testID')})}}/>
                  <Icon reverse raised name='ios-stats' type='ionicon' color='#517fa4' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}}/>
                  <Icon reverse raised name='md-help' type='ionicon' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}}/>
          </View>
      </View>
        <View style={{flex:1}}>
        <Admob type='fullbanner'/>
        {fontLoaded  && !isLoading ?  
         <View style={{flex:1}}>
            {scores && Object.keys(scores).length > 0 ?
              <FlatList
                  data={scores.reverse()}
                  keyExtractor={this.keyExtractors}
                  initialNumToRender={4}
                  renderItem={this.renderItems}
                  extraData={this.state}
                  style={{flex:1}}
              />
            :
            <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
              <Icon name='home' type='material' size={70} color={local_color.color1} />
              <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>No Test Taken..</Text>
              <Text style={{fontSize: 14, fontFamily:'SulphurPointNormal', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Go to the home page and prepare a test</Text>
            </View>
            }
        </View>:<Activity title='Scores' onPress={()=>{this.onPress(1)}} />}
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
  topic: state.topicReducer,
  theme: state.themeReducer,
  subject: state.subjectReducer,
  user: state.userReducer
})
export default connect(mapStateToProps,{ getTest, getScores })(ScoresScreen);
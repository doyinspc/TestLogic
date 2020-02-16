import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';


import { getScores } from './actions/Score';
import { getTest } from './actions/Test';
import Activity from './components/LoaderTest';


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
    };
  }

  relocate = (testID, scoreID) =>{
     this.props.navigation.navigate('ScoreScreen', {'testID':testID, 'scoreID':scoreID});
  }
 
  async componentDidMount() {
    this.props.getTest(this.props.navigation.getParam('testID'));
    this.props.getScores(this.props.navigation.getParam('testID'));

    if(!this.props.test.isLoading && Object.keys(this.props.test.test) > 0 )
    {
      let test_data =  this.props.test.test;
      let settings = test_data.settings.split(":::");
      this.setState({title:test_data.title, noq:settings[0]})
    }
    this.setState({testID: this.props.navigation.getParam('testID')});

    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
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
      this.props.navigation.navigate('TestSheetScreen', {'testID':this.state.testID});
    }
   
  }
  
  comp1 = () => <Icon name='home' color='white' type='material' />
  comp2 = () => <Icon name='cloud-upload' color='white' type='material' />
  comp3 = () => <Icon name='cloud-download' color='white' type='material' />
  comp4 = () => <Icon name='refresh' color='white' type='material' />

render(){

 const { scores, isLoading } = this.props.score;
 const { fontLoaded, selectedIndex, testID, noq } = this.state;
 
 const buttons = [{element:this.comp1}, {element:this.comp2} , {element:this.comp3} , {element:this.comp4}];
  return (
    <ThemeProvider >
        <View style={{flex:.4, backgroundColor:local_color.color1, borderBottomRightRadius: 25, borderBottomLeftRadius:25}}>
            <Text></Text>
        </View>
        <View style={{flex:1}}>
        {fontLoaded  && !isLoading ?  
         <ScrollView>
            {scores  && Object.keys(scores).length > 0 ?
            scores.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={ 
                  (l.score * 100) == 0 ? 
                        <Avatar overlayContainerStyle={{backgroundColor: local_color.color4}} activeOpacity={0.7}  rounded  icon={{ name: 'pause', color:local_color.color1, backgroundColor:'red' }} /> 
                        : (l.score * 100) < 60 ? 
                            <Avatar overlayContainerStyle={{backgroundColor: 'red'}} activeOpacity={0.7}  rounded  icon={{ name: 'delete', color:'white', backgroundColor:'red' }} />
                            : (l.score * 100) >= 60  && (l.score * 100) < 80 ?  <Avatar overlayContainerStyle={{backgroundColor: 'blue'}} activeOpacity={0.7}  rounded  icon={{ name: 'done', color:'white', backgroundColor:'red' }} />
                              : <Avatar overlayContainerStyle={{backgroundColor:local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: 'done-all', color:'white', backgroundColor:'red' }} />
              }
                title={l.created_at}
                rightTitle={`${l.score * 100}%`}
                subtitle={`${noq && noq > 0 && Object.keys(l.choices).length > 0 ? ((noq - Object.keys(l.choices).length)/noq) * 100: 0 }% completed`}
                titleStyle={styles.listItem}
                rightTitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color2}} 
                subtitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color4}} 
                rightSubtitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color4}}
                rightSubtitle={`${Math.floor(l.timeleft/60)} Mins`}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocate(testID, l.id)}}
                chevron
            />
            ))
            :
            <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
              <Icon name='home' type='material' size={70} color={local_color.color1} />
              <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>No Test Taken..</Text>
              <Text style={{fontSize: 14, fontFamily:'SulphurPointNormal', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Go to the home page and prepare a test</Text>
            </View>
            }
        </ScrollView>:<Activity title='Scores' onPress={()=>{this.onPress(1)}} />}
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
export default connect(mapStateToProps,{ getTest, getScores })(ScoresScreen);
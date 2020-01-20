import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';

import { getTests } from './actions/Test';
import Activity from './components/LoaderTest';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class TestScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      selectedIndex: null
    };
  }

  relocate = (value) =>{
    if(value && value > 0)
    {
     this.props.navigation.navigate('TestSheetScreen', {'testID':value})
    }
  }
 
  async componentDidMount() {
    this.props.getTests(JSON.stringify(this.props.navigation.getParam('subjectID')));

    
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Light.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  uploadTest =()=>{
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
        this.uploadTest()
    }
   
  }
  
  comp1 = () => <Icon name='home' color='white' type='material' />
  comp2 = () => <Icon name='cloud-upload' color='white' type='material' />

render(){
 const { tests, isLoading } = this.props.test;
 const { name } = this.props.subject.subject;
 const { fontLoaded , selectedIndex} = this.state;
 const buttons = [{element:this.comp1}, {element:this.comp2}];
  return (
    <ThemeProvider >
      <View style={styles.topSection}>
          <Text style={styles.h1}>{name}</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
                  <Icon reverse raised name='home' type='material' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}} />
                  <Icon reverse raised name='ios-list' type='ionicon' color='#517fa4' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('ThemeScreen',{'subjectID':this.props.navigation.getParam('subjectID')})}}/>
                  <Icon reverse raised name='ios-stats' type='ionicon' color='#517fa4' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}}/>
                  <Icon reverse raised name='help-circle' type='ionicon' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}}/>
          </View>
      </View>
        <View style={{flex:1}}>
        {fontLoaded  && !isLoading ?  
         <ScrollView>
            {tests  && Object.keys(tests).length > 0 ?
            tests.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}
                rightTitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color2}} 
                subtitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color4}} 
                rightSubtitleStyle={{fontFamily: 'SulphurPointNormal', color:local_color.color4}}   
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.title}
                subtitle={`${l.created_at}`}
                rightTitle={`${l.settings.split(':::')[0]} Qs`}
                rightSubtitle={`${Math.floor(l.testtime/60)} Mins`}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocate(l.id)}}
                chevron
            />
            ))
            :
            <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
              <Icon name='home' type='material' size={70} color={local_color.color1} />
              <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>No Test</Text>
              <Text style={{fontSize: 14, fontFamily:'SulphurPointNormal', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Go to the home page and prepare a test</Text>
            </View>
            }
        </ScrollView>:<Activity title='Subject' onPress={()=>{this.onPress(1)}} />}
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
  test: state.testReducer,
  topic: state.topicReducer,
  theme: state.themeReducer,
  subject: state.subjectReducer,
})
export default connect(mapStateToProps,{ getTests })(TestScreen);
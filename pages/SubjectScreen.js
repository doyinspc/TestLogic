import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon, Overlay, Button } from 'react-native-elements';
import * as Font from 'expo-font';

import { getSubjectsDownload, getSubjects, getSubject} from './actions/Subject';
import Activity from './components/LoaderTest';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class SubjectScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      selectedIndex: null,
      page:1,
      isVisible:false,
    };
  }

 async componentDidMount() {
  this.props.getSubjects();
  this.props.getSubjectsDownload();
  var page = this.props.navigation.getParam('sid');
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true, page:page });
}

//REDIRECT TO THEMES PAGE
//REQUIRE THEMECID
relocate = (value) =>{
  if(value && value > 0)
  {
    this.props.getSubject(value);
    this.props.navigation.navigate('ThemeScreen', {'subjectID':value, 'sid':this.state.page})
  }
}

//REDIRECT TO SUBJECT RESOURCES
relocateResources = (loc) =>{
    this.props.navigation.navigate('ThemeScreen');
}

//DOWNLOAD FROM HOME SERVER
//RELOAD PAGE WHEN DONE
updateSubjects =()=>{
  this.props.getSubjectsDownload();
}

changeVisibility = () =>{
  this.setState({isVisible:true})
}

//BOTTOM NAVIGATION
//0. BACK TO HOMESCREEN
//1. DOWNLOAD FROM HOME SERVER FUNCTION CALL
//2. SWITCH TO RESOURCES
updateIndex = (selectedIndex) =>{
  this.setState({ selectedIndex });
  if(selectedIndex == 0 )
  {
      this.props.navigation.navigate('HomeScreen');
  }
  else if(selectedIndex == 1 )
  {
      this.updateSubjects();
  }
  else if(selectedIndex == 2 )
  {
      var p = this.state.page == 1 ? 2 : 1;
      this.setState({page:p});
  }
}

comp1 = () => <Icon name='home' color='white' type='material' />
comp2 = () => <Icon name='cloud-download' color='white' type='material' />
comp3 = () => <Icon name={ this.state.page == 1 ? 'book' : 'spellcheck'} color='white' type='material' />
comp2a = () => <Icon name='spinner' color='white' type='evilicon' />
render(){
  const { subjects, isLoading, isDownloading } = this.props.subject;
  const { fontLoaded, selectedIndex, page } = this.state;
  const buttons = isDownloading ? [{element:this.comp1}, {element:this.comp2a}, {element:this.comp3}] :  [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];

  return (
    
    <ThemeProvider >
      <View style={styles.topSection}>
          <Text style={styles.h1}>Subjects</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
                  <Icon reverse raised name='home' type='material' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}} />
                  <Icon reverse raised name='ios-stats' type='ionicon'  color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('ChartScreen',{'stats':1})}}/>
                  <Icon reverse raised name='md-help' type='ionicon' color={local_color.color_icon} onPress={()=>{this.changeVisibility()}}/>
          </View> 
      </View>
      <View style={{flex:1}}>
      <Overlay
          isVisible={this.state.isVisible}
          windowBackgroundColor="rgba(7, 7, 7, .3)"
          overlayBackgroundColor= {local_color.color1}
          style={{minHeight:200, activeOpacity:0.3}}
          margin={15}
          padding={15}
          width="auto"
        >
          <View style={{flex:1, justifyContent:'space-between', alignContent:'space-between'}}>
          <Text style={styles.h1_overlay}>Info.</Text>
          <ScrollView>
          <View style={{flexDirection:'column', flexWrap:'wrap', margin:0, padding:10, justifyContent:'center', alignContent:'center'}}>
             <View style={{borderTopColor:local_color.color2, borderTopWidth:1}}>
                <Text style={styles.h2_overlay}>Instruction</Text>
                <Text style={{color:'white', fontFamily:'PoiretOne', marginTop:2 }}>
                  Select at least a subject.
                </Text>
             </View>

             <View >
                
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='home' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Move to home Page</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='cloud-download' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Download/Update Subject</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='book' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Switch to resources</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='spellcheck' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Switch to test</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='ios-stats' type='ionicon' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} >  View statistics</Text>
                </View>
             </View>
          </View>
          </ScrollView>
          <Button
                title='Close'
                style={styles.but_overlay}
                onPress={()=>this.setState({isVisible:false})}
                buttonStyle={{backgroundColor:local_color.color3}}
            />
          </View>
        </Overlay>
        {fontLoaded  && !isLoading ?  
         <ScrollView>
         {subjects  && Object.keys(subjects).length > 0 ?
            subjects.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocate(l.id)}}
                chevron
                badge={{  value: 'New', textStyle: { color: 'white', backgroundColor: 'red', padding:4, borderRadius:20, fontFamily:'PoiretOne' }, containerStyle: { marginTop: 10 } }}
            />
            ))
        : 
        <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
          <Icon name='cloud-download' type='material' size={70} color={local_color.color1} />
          <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Download Subjects</Text>
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

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
  subject: state.subjectReducer
})
export default connect(mapStateToProps, 
  { 
    getSubjects, 
    getSubjectsDownload,
    getSubject
  
  })(SubjectScreen);
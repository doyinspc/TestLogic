import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon , Overlay, Button} from 'react-native-elements';
import * as Font from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';

import { getTopics, getTopicSelected, getTopicsDownload } from './actions/Topic';
import Activity from './components/LoaderTest';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class TopicScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      isVisible: false,
      selectedIndex: null,
      checked: {},
      values: [],
      page:1,
      isVisible:false,
    };
  }

  //SHOW SELECTED THEMES
  showAlert = () =>{
    this.setState({showAlert: true});
  }
  hideAlert = () =>{
    this.setState({showAlert: false});
  }

  //REDIRECT TO TEST SETTINGS
  //ARGURMENTS : TOPICS
 relocate = () =>{
  let values = this.state.values;
    if(values && values.length > 0)
    {
    this.props.getTopicSelected(values);
    this.props.navigation.navigate('TestSettingsScreen', { 'topics':this.state.values, testID:null});
    }
 }

 //REDIRECT TO TOPIC SCREEN : RESOURCES
  //ARGUMENTS PASSED THE THEME IDS SELECTED
  relocateOne = (id) =>{
    let values = id;
    if(values)
    {
      this.props.navigation.navigate('ResourcesScreen', {'topicID':values, 'sid':this.state.page})
    }
  }

  changeVisibility = () =>{
    this.setState({isVisible:true})
  }

async componentDidMount() {
  let arry = this.props.navigation.getParam('themeID');
  this.props.getTopics(arry);
  this.props.getTopicsDownload(arry);
  var page = this.props.navigation.getParam('sid');
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true, page:page });

}

//STORE SELECTED TOPICS IN STATE ARRAY : VALUES
onChange = e => {
  let news = {...this.state.checked};
  news[e] = news[e] ? false : true;
  this.setState({checked : news});

  const currentIndex = this.state.values.indexOf(e);
  const newValues = [...this.state.values];

  if (currentIndex === -1) {
    newValues.push(e);
  } else {
    newValues.splice(currentIndex, 1);
  }
  this.setState({values:newValues});
  }

  //DOWNLOAD TOPICS, INSTRUCTIONS, QUESTIONS, ANSWERS, DISTRACTOR
  updateTopic=()=>{
    let arry = this.props.navigation.getParam('topicID');
    this.props.getTopicsDownload(arry);
  }

  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });
    if(selectedIndex == 0 )
    {
        this.props.navigation.navigate('HomeScreen');
    }
    else if(selectedIndex == 1 )
    {
        var p = this.state.page == 1 ? 2 : 1;
        this.setState({page:p});
    }
    else if(selectedIndex == 2 )
    {
        this.updateTopic();
    }
    else if(selectedIndex == 3 )
    {
        this.relocate()
    }
   
  }
  
  comp1 = () => <Icon name='home' color='white' type='material' />
  comp2 = () => <Icon name={ this.state.page == 1 ? 'book' : 'spellcheck'} color='white' type='material' />
  comp3 = () => <Icon name='cloud-download' color='white' type='material' />
  comp4 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Next</Text>

render(){
  const { topics, isLoading } = this.props.topic;
  const { themes, ids } = this.props.theme;
  const { name } = this.props.subject.subject;
  const { fontLoaded, selectedIndex, values, page } = this.state;
  const buttons = values && Object.keys(values).length > 0 && page == 1 ? [{element:this.comp1}, {element:this.comp2}, {element:this.comp3} , {element:this.comp4}] : [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];
  const list_themes = themes && Array.isArray(themes) && themes.length > 0  ? themes.filter((row)=>ids.includes(row.id)) : null;
  const list_data = list_themes && Array.isArray(list_themes) && list_themes.length > 0 ? list_themes.map((row) =>(<Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:2}} key={row.id}>{row.name}</Text>)) : <Text></Text>;

  return (
    <ThemeProvider >
      <View style={styles.topSection}>
          <Text style={styles.h1}>{name}</Text><View style={{flexDirection:'row', justifyContent:'center'}}>
                  <Icon reverse raised name='home' type='material' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}} />
                  <Icon reverse raised name='ios-stats' type='ionicon'  color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}}/>
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
          <View style={{ marginBottom:10}} >
                <Text style={styles.h2_overlay}>Subject</Text>
                <Text style={{color:'white', fontFamily:'PoiretOne', marginTop:2 }}>
                  {name}
                </Text>
             </View>
             <View style={{borderTopColor:local_color.color2, borderTopWidth:1, marginBottom:10}}>
                <Text style={styles.h2_overlay}>Themes</Text>
                <View style={{flexDirection:'column' }}>
                  {list_data}
                </View>
             </View>
             <View style={{borderTopColor:local_color.color2, borderTopWidth:1}}>
                <Text style={styles.h2_overlay}>Instruction</Text>
                <Text style={{color:'white', fontFamily:'PoiretOne', marginTop:2 }}>
                  Select at least one topic and move to the next page.
                </Text>
             </View>

             <View >
                
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='home' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Move to home Page</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='cloud-download' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Download/Update topics</Text>
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
        { page == 1 && topics && Object.keys(topics).length > 0 ? 
            topics.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                checkBox={{ 
                  checked: this.state.checked[l.id],
                  color: local_color.color1, 
                  onPress:()=>this.onChange(l.id) }}
            />
                )): page == 2 && topic  ? 
              topic.map((l, i) => (
              <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocateOne(l.id)}}
                chevron
            />
            ))  
          :
        <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
          <Icon name='cloud-download' type='material' size={70} color={local_color.color1} />
          <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Download Themes</Text>
        </View>
        }
        </ScrollView>:<Activity title='Topics' onPress={()=>{this.onPress(1)}} />}
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
  topic: state.topicReducer,
  theme: state.themeReducer,
  subject:state.subjectReducer
})
export default connect(mapStateToProps, 
  { 
    getTopics, getTopicSelected, getTopicsDownload
   }
   )(TopicScreen);
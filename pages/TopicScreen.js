import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';

import { getInstructionsID, getQuestionsID, getAnswersID, getDistractorsID } from './actions/Theme';
import { getTopics } from './actions/Topic';
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
      showAlert: false,
      selectedIndex: null,
      checked: {},
      values: []
    };
  }

  showAlert = () =>{
    this.setState({showAlert: true});
  }
  hideAlert = () =>{
    this.setState({showAlert: false});
  }

 relocate = () =>{
    this.props.navigation.navigate('TestSettingsScreen', { 'topics':this.state.values, testID:null})
 }


async componentDidMount() {
  let arry = this.props.navigation.getParam('topics');
  let arr = arry.toString().split(',');
  this.props.getTopics(arr.join());

  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true });
 
}

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

  updateData =(subject)=>{
        
           getInstructionsID(subject, (reso) =>{
            let instrs = []
            reso.forEach((m) =>{instrs.push(m.id)});

            getQuestionsID(instrs, (res) =>{
              let ques = []
              res.forEach((m) =>{ques.push(m.id)});

              getAnswersID(ques, (re) =>{
                let ans = []
                re.forEach((m) =>{ans.push(m.id)});
              })

              getDistractorsID(ques, (r) =>{
                let dis = []
                r.forEach((m) =>{dis.push(m.id)});
              }) 
                  
            })
          })
        
  
  }

  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });
    if(selectedIndex == 0 )
    {
        this.props.navigation.navigate('HomeScreen');
    }
    else if(selectedIndex == 1 )
    {
      if(this.state.values.length > 0)
      {
        this.props.navigation.navigate('TestSettingsScreen', { 'topics':this.state.values, testID:null})
      } else
      {
        //alert
      } 
    }
    else if(selectedIndex == 2 )
    {
        const subs = JSON.stringify(this.props.navigation.getParam('themeID'));
        this.updateTopic(subs)
    }
   
  }
  
  comp1 = () => <Icon name='home' color='white' type='material' />
  comp2 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Next</Text>
  comp3 = () => <Icon name='cloud-download' color='white' type='material' />

render(){
  const { topics, isLoading } = this.props.topic;
  const { fontLoaded, selectedIndex, values } = this.state;
  const buttons = [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];

  return (
    <ThemeProvider >
       <View style={{flex:1}}>
        {fontLoaded  && !isLoading ?  
         <ScrollView>
        {topics  && Object.keys(topics).length > 0 ? topics.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                checkBox={{ checked: this.state.checked[l.id], onPress:()=>this.onChange(l.id) }}
            />
            ))
          :
        <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
          <Icon name='cloud-download' type='material' size={70} color={local_color.color1} />
          <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Download Subjects</Text>
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
  topic: state.topicReducer
})
export default connect(mapStateToProps, 
  { 
    getTopics
   }
   )(TopicScreen);
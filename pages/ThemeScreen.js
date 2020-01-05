import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';

import { getThemes, getThemesCloud, getThemesID, getTopicsID, getInstructionsID, getQuestionsID, getAnswersID, getDistractorsID } from './actions/Theme';
import { getTopicsCloud } from './actions/Topic';
import { getQuestionsCloud } from './actions/Question';
import { getInstructionsCloud } from './actions/Instruction';
import { getAnswersCloud } from './actions/Answer';
import { getDistractorsCloud } from './actions/Distractor';

import Activity from './components/LoaderTest';


const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;


// Your App
class ThemeScreen extends React.Component{
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
 
  async componentDidMount() {
    this.props.getThemes(JSON.stringify(this.props.navigation.getParam('subjectID')));
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  updateTheme =(subject)=>{
    this.props.getThemesID(subject, (response)=>{
    });
  }

  updateData =(subject)=>{
    getThemesID(subject, (response)=>{
         let themes = [];
         response.forEach((m) =>{themes.push(m.id)});
         getTopicsID(themes, (resp) =>{
           let topics = []
           resp.forEach((m) =>{topics.push(m.id)});
           console.log('topics');
           console.log(topics);
           getInstructionsID(topics, (reso) =>{
            let instrs = []
            reso.forEach((m) =>{instrs.push(m.id)});
            console.log('instrs');
            console.log(instrs);
            getQuestionsID(instrs, (res) =>{
              let ques = []
              res.forEach((m) =>{ques.push(m.id)});
              console.log('ques');
              console.log(ques);
              
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
         })
    });
  }

  updateDatax =(subject)=>{
    getThemesID(subject, (response)=>{
         let themes = [];
         response.forEach((m) =>{themes.push(m.id)});
         getTopicsID(themes, (resp) =>{
           let topics = []
           resp.forEach((m) =>{topics.push(m.id)});
           console.log('topics');
           console.log(topics);
           getInstructionsID(topics, (reso) =>{
            let instrs = []
            reso.forEach((m) =>{instrs.push(m.id)});
            console.log('instrs');
            console.log(instrs);
            getQuestionsID(instrs, (res) =>{
              let ques = []
              res.forEach((m) =>{ques.push(m.id)});
              console.log('ques');
              console.log(ques);
              
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
         })
    });
  }
 
  //get selections and store in state
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
      this.props.navigation.navigate('TopicScreen', {'topicID':this.state.values})
    } else
    {
      //alert

    }
    
  }
  else if(selectedIndex == 2 )
  {
      const subs = JSON.stringify(this.props.navigation.getParam('subjectID'));
      this.updateTheme(subs)
  }
 
}

comp1 = () => <Icon name='home' color='white' type='material' />
comp2 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Next</Text>
comp3 = () => <Icon name='cloud-download' color='white' type='material' />

render(){
 const { themes, isLoading } = this.props.theme;
 const { fontLoaded, selectedIndex, values } = this.state;
 const buttons = [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];
 
  return (
    <ThemeProvider >
      <View style={{flex:1}}>
        {fontLoaded  && !isLoading ?  
         <ScrollView>
            {themes  && Object.keys(themes).length > 0 ? themes.map((l, i) => (
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
        </ScrollView>:<Activity title='Theme' onPress={()=>{this.onPress(1)}} />}
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
  theme: state.themeReducer
})
export default connect(mapStateToProps, 
  { 
    getThemes,
    getThemesCloud,
    getTopicsCloud,
    getInstructionsCloud,
    getQuestionsCloud,
    getAnswersCloud,
    getDistractorsCloud
  
  })(ThemeScreen);
import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Button, Avatar, ListItem } from 'react-native-elements';
import * as Font from 'expo-font';
import Activity from './components/Loader';
//import TabNav  from './components/TabNav';

import { getThemes, getThemesCloud, getThemesID, getTopicsID, getInstructionsID, getQuestionsID, getAnswersID, getDistractorsID } from './actions/Theme';
import { getTopicsCloud } from './actions/Topic';
import { getQuestionsCloud } from './actions/Question';
import { getInstructionsCloud } from './actions/Instruction';
import { getAnswersCloud } from './actions/Answer';
import { getDistractorsCloud } from './actions/Distractor';



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
      checked: {},
      values: []
    };
  }

  relocate = () =>{
    if(this.state.values.length > 0)
    {
     this.props.navigation.navigate('TopicScreen', {val:this.state.values})
    }
  }
 
  async componentDidMount() {
    this.props.getThemes(JSON.stringify(this.props.navigation.getParam('id')));
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
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

render(){
 const { theme, isLoading } = this.props;
 const subs = JSON.stringify(this.props.navigation.getParam('id'));
  return (
    <ThemeProvider >
       {isLoading ?  
        <Activity title='Themes' onPress={()=>{this.onPress(1)}} />:
       <View style={{flex: 10}}>
          <ScrollView>
            {
            theme.themes.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                badge={{  value: 457, textStyle: { color: 'white', backgroundColor:local_color.MAIN, borderRadius:20 }, containerStyle: { marginTop: 1 } }}
                checkBox={{ checked: this.state.checked[l.id], onPress:()=>this.onChange(l.id) }}
            />
            ))
            }
         </ScrollView>
        </View> }
        {this.state.values.length > 0? 
          <View style={{flex: 1}}>
            <Button 
              buttonStyle={styles.but}
              title='Proceed'
              onPress={()=>{this.relocate()}}
              />
           </View>:null}
           <View style={{flex: 1}}>
            <Button 
              buttonStyle={styles.but}
              title='Update'
              onPress={()=>{this.updateData(subs)}}
              />
           </View>
           <View style={{flex: 1, alignContent:'flex-end'}}>
              
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
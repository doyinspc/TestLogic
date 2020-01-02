import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Button, Avatar, Header, ListItem, CheckBox } from 'react-native-elements';
import * as Font from 'expo-font';
import { getInstructionsID, getQuestionsID, getAnswersID, getDistractorsID } from './actions/Theme';
import { getTopics } from './actions/Topic';
import Headers from './components/Header';
import Activity from './components/Loader';


const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class TopicScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      checked: {},
      values: []
    };
  }

 relocate = (id) =>{
    this.props.navigation.navigate('TestSettingsScreen', { topics:this.state.values.toString(), testID:null})
 }


async componentDidMount() {
  let arry = this.props.navigation.getParam('val');
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

render(){
  const { topics, isLoading } = this.props.topic;
  return (
    <ThemeProvider >
      {isLoading ?  
        <Activity title='Topics' onPress={()=>{this.onPress(3)}} />:
      <View style={{flex: 1}}>
        <View style={{flex: 9}}>
        <ScrollView>
        {
            topics.map((l, i) => (
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
        </View>
        {this.state.values.length > 0? 
        <View style={{flex: 1, alignContent:'flex-end'}}>
             <Button 
              style={styles.but}
              title='Test Settings'
              onPress={()=>{this.relocate(1)}}
              />
              <Button 
              style={styles.but}
              title='inst'
              onPress={()=>{this.updateData('1,2,3,4,5,6,7,8,9')}}
              />
        </View>:null}
        </View>}
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
   })(TopicScreen);
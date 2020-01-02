import React from 'react';
import { connect }from 'react-redux';
import { ThemeProvider, Button} from 'react-native-elements';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Pickers from './components/Picker';
import  SwitchSet from './components/Switch';
import * as Font from 'expo-font';
import Activity from './components/LoaderTest';
import { getTest } from './actions/Test';
import { getQuestions, getQuestionsSave, getQuestionsUpdate } from './actions/Topic';
import { ScrollView } from 'react-native-gesture-handler';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class TestSettingsScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      topics:'',
      title:'Test',
      description: '',
      noq: 10,
      hours: 1,
      minutes: 30,
      seconds: 0,
      result: 1,
      valueTimers: 1,
      valueAnswers: 1,
      fontLoaded: false,
      testLoaded: false,
      statePos: '',
      testID: null,
      userID:1,
      subjectID:1,
      isEdit: null,
    };
  }

  async componentDidMount() {
    //get topics id
    if(this.props.navigation.getParam('topics')){
      let topics = this.props.navigation.getParam('topics');
      this.setState({isEdit:false, topics:JSON.stringify(topics)});
      //get last test saved
      //add one to id
      //create new title Text + id + 1
      //save in state
      this.setState({ title: 'Test1234' });
    }
    
    if(this.props.navigation.getParam('testID')){

      let testID = this.props.navigation.getParam('testID');
      this.props.getTest(JSON.stringify(this.props.navigation.getParam('testID')));
      let test_data = this.props.test.test;

      if(test_data && Object.keys(test_data).length > 0){
        
        let hours = test_data.testtime/(60 * 60);
        let hour = Math.floor(hours);
        let mins = (test_data.testtime - (hour * 60 * 60)) / 60;
        let min = Math.floor(mins);
        let sec = test_data.testtime - ((hour * 60 * 60) + (min * 60)) ;

        let settings = test_data.settings.split(':::');
        
        this.setState({
          title: test_data.title,
          description: test_data.description,
          noq: settings[0],
          hours: hour,
          minutes: min,
          seconds: sec,
          valueTimers: settings[1],
          valueAnswers: settings[2],
          testID: testID,
          isEdit: true,
        });
        
      }
    }

    await Font.loadAsync({
      'PoiretOne': require("../assets/fonts/PoiretOne-Regular.ttf"),
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
    
  }

  

  valueTimer = (a) =>{
    this.setState({valueTimers:a})
  }
  valueAnswer = (a) =>{
    this.setState({valueAnswers:a})
  }

  onSubmit = () =>{
    this.props.navigation.navigate('ScoresScreen', {'testID':this.state.testID});
  }

  onPrepare = () =>{
    //activity pulling questions
    const { isLoading, testRawQuestions, activeTestID } = this.props.topic;
    const { noq, topics } = this.state;

    this.setState({statePos:'Loading Questions', fontLoaded: false});
    let arr = topics.toString().split(',');
    this.props.getQuestions('"1", "2"');
    if(!isLoading){
      if(testRawQuestions &&  testRawQuestions.length > 0)
      {
        //preparing questions
        this.setState({statePos: 'Preparing Test'});
        this.deConstruct(testRawQuestions)
        .then((data)=>{
          //saving test 
          this.setState({statePos: 'Saving Test'});
          let tID = this.saveTest(data);
          this.setState({getID: tID});
          if(!isLoading && tID > 0)
          {
            this.setState({ fontLoaded: true });
            this.setState({statePos:'Done'});
          }else{
            this.setState({ fontLoaded: true });
            this.setState({statePos:'Failed to save '});
          }
        })
        .catch((error)=>console.log(error));  
      }
    }
    else
    {
      this.setState({ fontLoaded: false });
    }

   
  }

  onEditPrepare = () =>{
    let { title, description, noq, hours, minutes, seconds, valueTimers, valueAnswers } = this.state;
    let total_hours = hours * 60 * 60;
    let total_minutes = minutes * 60;
    let total_seconds = seconds;
    let total_time = total_hours + total_minutes + total_seconds;
    let settings = `${noq}:::${valueTimers}:::${valueAnswers}`;
  
     let $f = {};
     $f['id'] = this.state.testID;
     $f['title'] = title;
     $f['description'] = description;
     $f['testtime'] = total_time;
     $f['settings'] = settings;
    
     let test_id = this.props.getQuestionsUpdate($f);
     return test_id;
   
  }
  
  
deConstruct = (arr) =>{
  return new Promise((resolve, reject)=>{
    let idStore = [];
    let answerStore = {};
    let optionStore = {};
    let instructionStore = {};
    let questionStore = {};
    let struct = {};
      arr.forEach(element => {
        //get answer
        let ans = element.answer;
        let answ = [];
        let answer = '';
        if(ans && ans.length > 0){
            answ = ans.split(',');
        }
        if(answ.length > 0){
          if(answ.length == 1){
              answer = answ[0];
          }
          else if(answ.length > 1){
                answ = shuffle(answ);
                answer = answ[0];
          }
        }else{
            answer = 'All options are incorrect';
        }
        //get distractor
          let dis = element.distractor;
          let disw = [];
          let diswer = [];
          //confirm if any distractor is available
          if(dis && dis.length > 0){
            //if available convert the string to array
            disw = dis.split(',');
          }else{
            //else no distractor string create empty array
            disw = ['None is incorrect']
          }

          if(disw.length > 0){
            if(disw.length < 3){
              // less than three distractors
              for(let i = 0; i < disw.length; i++){
                diswer[i] = disw[i];
              }
            }
            else if(disw.length == 3){
              // three distractors available
              diswer = disw;
            }
            else if(disw.length > 3){
              // more than three distractors available
              //shuffle and pick first three
                disw = shuffle(disw);
                diswer[0] = disw[0];
                diswer[1] = disw[1];
                diswer[2] = disw[2];
            }
          }else{
            diswer[0] = 'All options are incorrect';
          }
        //combine answer and distractor
        //get answers position
        let totalPositions = diswer.length + 1;
        let randomPosition = Math.floor(Math.random() * totalPositions) - 1;
        let rem = diswer.splice(randomPosition, 0, answer);
        let options = diswer;
        //console.log(options);
        //store answer
        
        idStore.push(element.qid);
        answerStore[element.qid] = randomPosition;
        optionStore[element.qid] = options;
        questionStore[element.qid] = [element.ind, element.question, element.question_img, element.question_audio, element.question_video];
        instructionStore[element.ind] = [element.namex, element.contenttitle, element.content]
          
      });

    struct['ids']  = idStore;
    struct['questions'] = questionStore;
    struct['options'] = optionStore;
    struct['answers'] = answerStore;
    struct['instructions'] = instructionStore;
    if(struct){
      resolve(struct);
    }else{
      reject('Question not available');
    }
  

  })
}
saveTest=(data)=>{
  let{ title, description, noq, hours, minutes, seconds, valueTimers, valueAnswers } = this.state;
  
  let total_hours = hours * 60 * 60;
  let total_minutes = minutes * 60;
  let total_seconds = seconds;
  let total_time = total_hours + total_minutes + total_seconds;
  let settings = `${noq}:::${valueTimers}:::${valueAnswers}`;
  let userID = "1";
  let subjectID = "1";

   let $f = {};
   $f['userID'] = userID;
   $f['subjectID'] = subjectID;
   $f['title'] = title;
   $f['description'] = description;
   $f['testtime'] = total_time;
   $f['settings'] = settings;
   $f['ids'] = JSON.stringify(data.ids);
   $f['instructions'] = JSON.stringify(data.instructions);
   $f['questions'] = JSON.stringify(data.questions);
   $f['options'] = JSON.stringify(data.options);
   $f['answers'] = JSON.stringify(data.answers);
   $f['questionweigth'] = JSON.stringify(data.questionweight);
   let test_id = this.props.getQuestionsSave($f);
   return test_id;
}


render(){
  const { theme } = this.props;
  const { fontLoaded , testLoaded, statePos, testID, isEdit } = this.state;

  let data =[
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


  let datax =[
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

  
  return (
    <View style={{flex:1}}>
      {fontLoaded?
        <View style={{flex:1, flexDirection:'column'}} >
              <ScrollView>
              <View style={styles.section_container}>
                  <Icon name='edit' style={styles.section_icon}/>
                  <Text style={styles.section_text}>Basic Settings </Text>
              </View>

          <View style={{paddingLeft:30, paddingRight:30}}>
              <View style={styles.textwidthx}>
                  <Text style={styles.label}>Test title</Text> 
              </View>
              <TextInput
                style={styles.textplace}
                placeholder='Short Title'
                value={this.state.title.toString()}
                defaultValue={this.state.title.toString()}
                onChangeText={(text) => this.setState({title: text})}
                type='text'
              />

              <View style={styles.textwidthx}>
                  <Text style={styles.label}>Number of Questions</Text> 
              </View>
             <TextInput
                style={styles.textplace}
                placeholder='0 - 100'
                value={this.state.noq.toString()}
                defaultValue={this.state.noq.toString()}
                keyboardType='numeric'
                onChangeText={(text) => this.setState({noq: text})}
                type='number'
              />
              
              <View style={{flex:1, flexDirection:'column', flexGrow: 1, padding: 2}}>
                        <View style={styles.textwidthx}>
                          <Text style={styles.label}>Description</Text> 
                        </View>
                        <TextInput
                            style={styles.textplace}
                            placeholder='Brief Explanation for future reference (optional)'
                            value={this.state.description.toString()}
                            defaultValue={this.state.description.toString()}
                            onChangeText={(text) => this.setState({description: text})}
                            type='text'
                        />
                    </View>
        </View>
        <View style={styles.section_container}>
              <Icon name='alarm' type='material' style={styles.section_icon}/>
              <Text style={styles.section_text}>Timer </Text>
        </View>
        <View style={{flex:1, marginLeft:30, flexDirection:'row'  , alignItems: 'center'}} >
                    <View style={{flex:1, flexDirection:'column', flexGrow: 1, padding: 2}} >
                        <View style={styles.textwidthx_min}>
                        <Text style={styles.label_min}>Hours</Text> 
                        </View>
                        <TextInput
                            style={styles.textplace_min}
                            placeholder='00'
                            value={this.state.noq.toString()}
                            defaultValue={this.state.hours.toString()}
                            keyboardType='numeric'
                            onChangeText={(text) => this.setState({hours: text})}
                            type='number'
                        />
                    </View>

                    <View style={{flex:1, flexDirection:'column', flexGrow: 1, padding: 2}}>
                      <View style={styles.textwidthx_min}>
                        <Text style={styles.label_min}>Minutes</Text> 
                      </View>
                        <TextInput
                          style={styles.textplace_min}
                          placeholder='00'
                          value={this.state.minutes.toString()}
                          defaultValue={this.state.minutes.toString()}
                          keyboardType='numeric'
                          onChangeText={(text) => this.setState({minutes: text})}
                          type='number'
                        />
                    </View>

                    <View style={{flex:1, flexDirection:'column', flexGrow: 1, padding: 2}}>
                      <View style={styles.textwidthx_min}>
                          <Text style={styles.label_min}>Seconds</Text> 
                      </View>
                      <TextInput
                          style={styles.textplace_min}
                          placeholder='00'
                          value={this.state.seconds.toString()}
                          defaultValue={this.state.seconds.toString()}
                          keyboardType='numeric'
                          onChangeText={(text) => this.setState({seconds: text})}
                          type='number'
                      />
                    </View>
                    
              </View>
        <View style={{flex: 1, marginLeft:30}} >
          {
            datax.map(ele =>(
                <View key={`xx${ele.id}`} style={{flexDirection:'row'}}>
                <RadioButton
                  value={ele.id}
                  status={this.state.valueTimers  && ele.id === this.state.valueTimers  ? 'checked' : 'unchecked'}
                  onPress={() =>{this.valueTimer(ele.id)}}
                />
               <Text style={styles.label_radio}>{ele.name}</Text>
              </View>
              
            ))
          }
        </View>
        <View style={styles.section_container}>
              <Icon name='alarm_add' type='material' style={styles.section_icon}/>
              <Text style={styles.section_text}>Answer </Text>
        </View>
        <View style={{flex: 1,  marginLeft:30}} >
          {
            data.map(ele =>(
                <View key={`yy${ele.id}`} style={{flexDirection:'row'}}>
                <RadioButton
                  value={ele.id}
                  status={this.state.valueAnswers  && ele.id == this.state.valueAnswers  ? 'checked' : 'unchecked'}
                  onPress={() =>{this.valueAnswer(ele.id)}}
                />
               <Text style={styles.label_radio}>{ele.name}</Text>
              </View>
              
            ))
          }
        </View>
       
       
        </ScrollView>
            { !isEdit  ?<Button
                large
                icon={{name: 'home', type: 'material', color:'#fff' }}
                title='Prepare Test' 
                buttonStyle={styles.butSetting}
                onPress={()=>{this.onPrepare()}}
                />:
                <Button
                large
                icon={{name: 'gears', type: 'material', color:'#fff' }}
                title='Save Settings' 
                buttonStyle={styles.butSetting}
                onPress={()=>{this.onEditPrepare()}}
                />
                
                }
             { testID && testID > 0 ? 
               <Button
                large
                icon={{name: 'save', type: 'material', color:'#fff' }}
                title='START TEST' 
                buttonStyle={styles.butSetting}
                onPress={()=>{this.onSubmit(testID)}}
                />
                : null
                }
        </View>
        :<Activity title={statePos}/>
        }
   
   </View>
  );
};
}

const styles = StyleSheet.create(local_style)

const mapStateToProps = state => ({ 
  test: state.testReducer,
  topic: state.topicReducer
})
export default connect(mapStateToProps, { getTest, getQuestions, getQuestionsSave, getQuestionsUpdate })(TestSettingsScreen);
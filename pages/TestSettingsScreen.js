import React from 'react';
import { connect }from 'react-redux';
import { ThemeProvider, Button, ButtonGroup, Icon, Overlay} from 'react-native-elements';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import * as Font from 'expo-font';
import Activity from './components/LoaderTest';
import { getTest, insertTest, updateTest } from './actions/Test';
import { getQuestions } from './actions/Question';
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
      topics:[],
      title:'Test',
      description: '',
      noq: 5,
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
      selectedIndex: null,
      name:'',
      isVisible:false,
    };
     this.onPrepare= this.onPrepare.bind(this);
  }

  async componentDidMount() {
    //get topics id
    if(this.props.navigation.getParam('topics')){
      let arry = this.props.navigation.getParam('topics');
      this.setState({ 
        isEdit:false, 
        topics: arry,
        title: this.props.subject.subject.name,
        description: this.props.subject.subject.name,
      });
    }
    
    if(this.props.navigation.getParam('testID')){
      let testID = this.props.navigation.getParam('testID');
      this.props.getTest(JSON.stringify(testID));
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
          isEdit: true
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

  changeVisibility = () =>{
    this.setState({isVisible:true})
  }
  valueTimer = (a) =>{
    this.setState({valueTimers:a})
  }
  valueAnswer = (a) =>{
    this.setState({valueAnswers:a})
  }
  onSubmit = () =>{
    this.props.navigation.navigate('TestSheetScreen', {'testID':this.state.testID});
  }
  onPrepare(){
    
    //activity pulling questions
    const { isLoading } = this.props.question;

    this.setState({statePos:'Loading Questions', fontLoaded: false});
    let arry = this.props.navigation.getParam('topics');
    this.setState({statePos: this.props.question.msg});
    this.props.getQuestions(arry, this.state.noq, q =>{
      console.log(q)
      if(q){
          this.setState({statePos: 'Preparing Test'});
          this.deConstruct(q, (data) =>{
            if(data){
              //saving test 
              this.setState({statePos: 'Saving Test'});
              this.saveTest(data, tID =>{
                this.setState({testID: tID});
                if(tID > 0)
                {
                  this.setState({ fontLoaded: true });
                  this.setState({ statePos:'Done'});
                  this.props.navigation.navigate('TestSheetScreen', { 'testID':tID })
                }else{
                  this.setState({ fontLoaded: true });
                  this.setState({ statePos:'Failed to save '});
                }
              }); 
            }  
          });  
      }
      else
      {
        this.setState({ fontLoaded: true });
      }
    });

    

   
  }

  onEditPrepare = () =>{
    let { testID, title, description, noq, hours, minutes, seconds, valueTimers, valueAnswers } = this.state;
    let total_hours = hours * 60 * 60;
    let total_minutes = minutes * 60;
    let total_seconds = seconds;
    let total_time = total_hours + total_minutes + total_seconds;
    let settings = `${noq}:::${valueTimers}:::${valueAnswers}`;
  
     let $f = {};
     $f['id'] = testID;
     $f['title'] = title;
     $f['description'] = description;
     $f['testtime'] = total_time;
     $f['settings'] = settings;
    
     this.props.updateTest($f, (d)=>{
        d == 1 ? this.props.navigation.navigate('TestSheetScreen', { 'testID':tID }) : null ;
     });
  }
  
  
deConstruct = (arr, callback) =>{
    //creat array to store items
    let idStore = [];
    let answerStore = {};
    let optionStore = {};
    let instructionStore = {};
    let questionStore = {};
    //general store
    let struct = {};
      arr.forEach(element => {
        //get answer
        let ans = element.answer;
        let answ = [];
        let answer = {};
        if(ans && ans.length > 0){
            answ = ans.split(':::::');
        }

        if(answ.length > 0){
          if(answ.length == 1){
              let answer_string = answ[0].split(':::');
              answer[answer_string[0]] = answer_string[1];
          }
          else if(answ.length > 1){
                answ = this.shuffle(answ);
                let answer_string = answ[0].split(':::');
                answer[answer_string[0]] = answer_string[1];
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
            disw = dis.split(':::::');
          }else{
            //else no distractor string create empty array
            disw = ['None answer']
          }
          
          if(disw.length > 0){
            if(disw.length < 4){
              // less than three distractors
              for(let i = 0; i < disw.length; i++){
                let diswer_string = disw[i].split(':::');
                diswer[`d${diswer_string[0]}`] = diswer_string[1];
              }
            }
            else if(disw.length > 3){
                // more than three distractors available
                //shuffle and pick first three
                disw = this.shuffle(disw);
                //pick first option
                let diswer_string0 = disw[0].split(':::');
                diswer[`d${diswer_string0[0]}`] = diswer_string0[1];
                //pick second option
                let diswer_string1 = disw[1].split(':::');
                diswer[`d${diswer_string1[0]}`] = diswer_string1[1];
                //pick third option
                let diswer_string2 = disw[2].split(':::');
                diswer[`d${diswer_string2[0]}`] = diswer_string2[1];
            }
          }else{
            diswer[0] = 'All options are incorrect';
          }
        //combine answer and distractor
        let merged = {...diswer, ...answer};
        //get answers position
        let getKeys = Object.keys(merged);
        
       
        let options = [];
        getKeys.map((d) =>{
            options.push([d, merged[d]]);
        })
        options = this.shuffle(options);
        //store answer 
        idStore.push(element.qid);
        answerStore[element.qid] = answer;
        optionStore[element.qid] = options;
        questionStore[element.qid] = [element.ind, element.question, element.question_img, element.question_audio, element.question_video];
        instructionStore[element.ind] = [element.namex, element.contenttitle, element.content];    
      });

    struct['ids']  = idStore;
    struct['questions'] = questionStore;
    struct['options'] = optionStore;
    struct['answers'] = answerStore;
    struct['instructions'] = instructionStore;
    callback(struct);
}

shuffle=(array) => {
  return array.sort(() => Math.random() - 0.5);
}

saveTest= (data, callback) =>{
  let{ topics, title, description, noq, hours, minutes, seconds, valueTimers, valueAnswers } = this.state;
  
  let total_hours = hours * 60 * 60;
  let total_minutes = minutes * 60;
  let total_seconds = seconds;
  let total_time = total_hours + total_minutes + total_seconds;
  let settings = `${noq}:::${valueTimers}:::${valueAnswers}`;
  let userID = "1";
  let subjectID = "1";

   let $f = {};
   $f['topics'] = JSON.stringify(topics);
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
   console.log($f);
   this.props.insertTest($f, (id)=>{
        console.log('saved');
        callback(id);
   });
   
}

updateIndex = (selectedIndex) =>{
  this.setState({ selectedIndex });
  if(selectedIndex == 0 )
  {
      this.props.navigation.navigate('HomeScreen');
  }
  else if(selectedIndex == 1 )
  {
    console.log(this.state.testID);
    if(this.state.testID && this.state.testID > 0)
    {
      this.props.navigation.navigate('TestSheetScreen', { 'testID':this.state.testID })
    } else
    {
      //alert
      this.onPrepare();
    } 
  }
  else if(selectedIndex == 2 )
  {
    if(this.state.testID && this.state.testID > 0)
    {
      this.onEditPrepare;
    }
  }
 
}

comp1 = () => <Icon name='home' color='white' type='material' style={styles.section_icon} />
comp2 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Next</Text>
comp3 = () => <Icon name='save' color='white' type='material' style={styles.section_icon} />

render(){
  const { themes, ids } = this.props.theme;
  const { topics} = this.props.topic;
  const { fontLoaded , statePos, selectedIndex} = this.state;
  const { name } = this.props.subject.subject;
  const buttons = this.state.testID > 0 ? [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}] : [{element:this.comp1},  {element:this.comp3}] ;
  const list_topics = topics && Array.isArray(topics) && topics.length > 0  ? topics.filter((row)=>this.props.topic.ids.includes(row.id)) : null;
  const list_data_topics = list_topics && Array.isArray(list_topics) && list_topics.length > 0 ? list_topics.map((row) =>(<Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:2}} key={row.id}>{row.name}</Text>)) : <Text></Text>;
  const list_themes = themes && Array.isArray(themes) && themes.length > 0  ? themes.filter((row)=>ids.includes(row.id)) : null;
  const list_data = list_themes && Array.isArray(list_themes) && list_themes.length > 0 ? list_themes.map((row) =>(<Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:2}} key={row.id}>{row.name}</Text>)) : <Text></Text>;
  if(!this.props.question.isLoading)
  {
    //this.setState({statePos: this.props.question.msg});
  }
  

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
      <View style={styles.topSection_small}>
          <Text style={styles.h1}>{name}</Text>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
                  <Icon reverse raised name='home' type='material' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}} />
                  <Icon reverse raised name='md-help' type='ionicon' color={local_color.color_icon} onPress={()=>{this.changeVisibility()}}/>
          </View>
      </View>
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
             <View style={{borderTopColor:local_color.color2, borderTopWidth:1, marginBottom:10}}>
                <Text style={styles.h2_overlay}>Topics</Text>
                <View style={{flexDirection:'column' }}>
                  {list_data_topics}
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
      {fontLoaded ?
        <View style={{flex:1, flexDirection:'column'}} >
              <ScrollView>
              <View style={styles.section_container}>
                  <Icon name='gear' color='white'  type='octicon' style={styles.section_icon}/>
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
              <Icon name='watch' color='white' type='octicon' style={styles.section_icon}/>
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
                            value={this.state.hours.toString()}
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
              <Icon name='info' type='octicon' style={styles.section_icon}/>
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
        <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={styles.genButtonGroup}
            selectedButtonStyle={styles.genButtonStyle}
            textStyle={styles.genButtonTextStyle}
            />
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
  topic: state.topicReducer,
  theme: state.themeReducer,
  question: state.questionReducer,
  subject: state.subjectReducer,
})
export default connect(mapStateToProps, { getTest, getQuestions, insertTest, updateTest })(TestSettingsScreen);
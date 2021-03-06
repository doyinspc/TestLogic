import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ImageBackground , ScrollView, TouchableHighlight, SafeAreaView} from 'react-native';
import { Icon } from 'react-native-elements';
import { ThemeProvider, Button } from 'react-native-elements';
import { getSubjectsClear, getTableClear, dropTable } from './actions/Subject';
import { EMAIL } from './actions/Common';
import Admob from './advert/Admob';
import {
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

// Your App
const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;


class HomeScreen extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      selectedIndex: null
    };
  }

  componentDidMount(){
    this.initAds().catch((error) => console.log(error));
  }
  
  initAds = async () => {
   await setTestDeviceIDAsync('EMULATOR');
  }
   dropSubjects =()=>{
    this.props.getSubjectsClear();
   }
   dropTable = table => {
    this.props.getTableClear(table);
   }
  
  render() {
    
    return (
      <ThemeProvider >
        <ImageBackground
            source={require('./../assets/images/main.jpg')}
            style={{
              flex:.4,
              position: 'relative', 
              top: 0,
              left: 0,
              marginBottom:10,
            }}
          >
          <Text style={{ 
             fontFamily:'PoiretOne',
             fontSize: 50,
             color:'white',
             alignContent:'space-around',
             justifyContent:'flex-end',
             alignSelf:'flex-end',
             paddingTop:40,
             paddingRight:20,
             paddingBottom:1,
          }}> Q&A</Text>
          <Text style={{ 
             fontFamily:'SulphurPoint',
             fontSize: 10,
             color:'white',
             alignContent:'space-around',
             justifyContent:'flex-end',
             alignSelf:'flex-end',
             paddingTop:2,
             paddingRight:20,
          }}>{this.props.user.user.email}</Text>
          <View
              style={{
                color:'white',
                position: 'absolute',
                bottom: 0,
                margin: 0,
                padding: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                width: '100%'
              }}
          >
              <Text style={{alignSelf:'center', color:'white', fontFamily:'SulphurPointNormal'}}>{`Mobile Learning Center `}</Text>
          </View>
        </ImageBackground>
        
        <View style={{backgroundColor:local_color.color4,  flex:1, justifyContent:'space-between'}}>
        <Admob type='fullbanner'/>
        <ScrollView>
        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('SubjectScreen',{'sid':1})}} underlayColor="grey">
        <View style={styles.home_list_container}>
        <Icon name='spellcheck' padding={10}  paddingLeft={30} color= 'red' size={80} type="material"/>
        <View style={{padding:10, flexShrink:1}}>
          <Text style={styles.home_h1}>Subjects Pool</Text>
          <Text style={styles.home_h2}>Learn with a focus, get thousands of test questions online and offline</Text>  
        </View>
        </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('SubjectScreen',{'sid':2})}} underlayColor="grey">
        <View style={styles.home_list_container}>
        <Icon name='book' padding={10}  paddingLeft={20} color='green' size={80} type="material"/>
        <View style={{padding:10, flexShrink:1}}>
          <Text style={styles.home_h1}>Academic Resources</Text>
          <Text style={styles.home_h2}>Access thousands of relevant academic resources literatures, videos, images etc.</Text>
        </View>
        </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('SubjectScreen', {'sid':3})}} underlayColor="grey">
        <View style={styles.home_list_container}>
        <Icon name='ios-trophy' padding={10}  paddingLeft={35} color= 'skyblue' size={80} type="ionicon"/>
        <View style={{padding:10, flexShrink:1}}>
          <Text style={styles.home_h1}>Mock Test</Text>
          <Text style={styles.home_h2}>Simulate test</Text>
        </View>
        </View>
        </TouchableHighlight>
        
        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('PaymentScreen')}} underlayColor="grey">
        <View style={styles.home_list_container}>
        <Icon name='payment' padding={10}  paddingLeft={30} color= {local_color.color2} size={80} type="fontawesome"/>
        <View style={{padding:10, flexShrink:1}}>
          <Text style={styles.home_h1}>Upgrade to Pro.</Text>
          <Text style={styles.home_h2}>Remove ads, get frequent question updates, full access to all mock test</Text>
        </View>
        </View>
        </TouchableHighlight>
        
          <View>
          <Button 
              title='DROP Test Table'
              onPress={()=>{this.props.dropTable('test')}}
              />
          </View>
          <View>
          <Button 
              title='DROP Users Table'
              onPress={()=>{this.props.dropTable('user')}}
              />
          </View>
          <View>
          <Button 
              title='DROP question Table'
              onPress={()=>{this.props.dropTable('question')}}
              />
          </View>
          <View>
          <Button 
              title='DROP Test Table'
              onPress={()=>{this.props.dropTable('test')}}
              />
          </View>
          <View>
          <Button 
              title='DROP Score Table'
              onPress={()=>{this.props.dropTable('score')}}
              />
          </View>
          <View>

          <Button 
              title='DROP Topic Table'
              onPress={()=>{this.props.dropTable('topic')}}
              />
          </View>
          <View>

            <Button 
                title='DROP Question Table'
                onPress={()=>{this.props.dropTable('question')}}
                />
            </View>
            <View>

            <Button 
                title='DROP Answer Table'
                onPress={()=>{this.props.dropTable('answer')}}
                />
            </View>
            <View>

            <Button 
                title='DROP Distractor Table'
                onPress={()=>{this.props.dropTable('distractor')}}
                />
            </View>
          <View>
          <Button 
              title='DROP Subject Table'
              onPress={()=>{this.props.dropTable('subject')}}
              />
          </View>

          <View>
          <Button 
              title='Show Test Settings'
              onPress={()=>{this.props.navigation.navigate('TestSettingsScreen', {'topics':'1,2,3,4,5'})}}
              />
          </View>
          <View>
          <Button 
              title='Show All Test'
              onPress={()=>{this.props.navigation.navigate('TestScreen', {'subjectID':1})}}
              />
          </View>
          <View>
          <Button 
              title='Question'
              onPress={()=>{this.props.navigation.navigate('QuestionScreen', {'testID':1})}}
              />
          </View>
          </ScrollView>
          </View>
      </ThemeProvider>
    );
  }
};

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
  subject: state.subjectReducer,
  user: state.userReducer
})
export default connect(mapStateToProps, { getSubjectsClear, getTableClear, dropTable })(HomeScreen);
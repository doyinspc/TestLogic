import React from 'react';
import {  Button } from 'react-native-elements';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import GoogleScreen from './GoogleScreen';
import FacebookScreen from './FacebookScreen';
import { postUser, getUser } from './actions/User';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;
const theme = {
  
};


// Your App
export default class App extends React.Component{
  state = {
    fontLoaded: false,
    password:'',
    email:'',
    error:'',
    isActive: false,
  }
  
  async componentDidMount() {
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  onSubmit = () =>{
    const { password, email } = this.state;
    const user = {password, email };
    if(this.state.password ){
      this.props.navigation.navigate('SubjectScreen');
    }else{
      this.setState({ error: 'passwords do not match'});
    }

  }

  render(){
    const { fontLoaded,  email, password, isActive } = this.state;
    return (
      <View style={{flex:1}}>
      {fontLoaded ? 
       isActive ?
      <View style={{flex:1}}>
        <View style={styles.topContainer}>
          <Text style={styles.h1}>Login</Text>
          <Text style={styles.h2}>Select a Login method</Text>
       </View>
       <View style={[styles.bottomContainer, {marginVertical:5}]}>
         <View style={{marginVertical:10}}>
           <GoogleScreen/>
         </View>
         <View>
           <FacebookScreen/>
          </View>
       </View>
       </View>: this.props.navigation.navigate('HomeScreen')  : null}
       </View>
   
  );
  }
};

const styles = StyleSheet.create(local_style);
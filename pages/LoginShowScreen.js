import React from 'react';
import {  Button } from 'react-native-elements';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import GoogleScreen from './GoogleScreen';


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
    error:''
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
    const { fontLoaded,  email, password } = this.state;
    return (
      <View style={{flex:1}}>
      {fontLoaded ? <View style={{flex:1}}>
        <View style={styles.topContainer}>
          <Text style={styles.h1}>Login</Text>
          <Text style={styles.h2}>Select a Login method</Text>
       </View>
       <View style={styles.bottomContainer}>
           <GoogleScreen/>
           <FacebookScreen/>
       </View>
       </View> : null}
       </View>
   
  );
  }
};

const styles = StyleSheet.create(local_style);
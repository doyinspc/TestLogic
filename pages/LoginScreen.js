import React from 'react';
import {  Button } from 'react-native-elements';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { connect }from 'react-redux';
import GoogleScreen from './GoogleScreen';
import FacebookScreen from './FacebookScreen';
import { postUser, getUser, getUse } from './actions/User';
import {
  USER_GET_ONE,
  USER_LOADING_ERROR
} from "./types/User";


import { DB_PATH } from './actions/Common';
import  SCHEME  from './api/Schema';
import axios from 'axios';

const db = DB_PATH;
const TABLE_NAME = SCHEME.user.name;
const TABLE_STRUCTURE = SCHEME.user.schema;
const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;
const theme = {
  
};


// Your App
class LogIn extends React.Component{
  state = {
    fontLoaded: false,
    password:'',
    email:'',
    error:'',
    isActive:true
  }
  
  async componentDidMount() {
    await this.props.getUser();
    this.setState({isActive: await this.props.user.isActive});
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  onSubmit = () => (dispatch) =>{
    const { password, email, isActive } = this.state;
    const user = {password, email, isActive};
    let PARAM = {
      email:email,
      password:password,
      social: 3,
    };
    if(this.state.password)
    {
      db.select(TABLE_NAME, TABLE_STRUCTURE, PARAM, async (data)=>{
        if(data._array && Array.isArray(data._array) && parseInt(data.length) > 0){
           await dispatch({type: USER_GET_ONE, payload: data._array});
           if(data._array[0])
           {
            this.setState({isActive:true});
           }
         }else{
            dispatch({ type : USER_LOADING_ERROR, msg : 'No file'});
         }
      })
    }
  }

  render(){
    const { fontLoaded, email, password, isActive } = this.state;
    if(isActive)
    {
      this.props.navigation.navigate('HomeScreen');
    }
    return (
      <View style={{flex:1}}>
      {fontLoaded ? <View style={{flex:1}}>
        <View style={styles.topContainer}>
          <Text style={styles.h1}>Login</Text>
          <Text style={styles.h2}>Choose a Login method</Text>
       </View>
       <View style={styles.bottomContainer}>
       <View style={{flexDirection:'row', justifyContent:'center'}}>
                  <GoogleScreen/>
                  <FacebookScreen/>
        </View>
            
              <View style={styles.textwidthx}>
              <Text style={styles.label}>Email or Phone Number</Text> 
              </View>
             <TextInput
                style={styles.textplace}
                placeholder='Email'
                type='email'
                value={email}
                onChangeText={(text) => this.setState({email: text})}
            />
            <View style={styles.textwidthx}>
            <Text style={styles.label}>Password</Text>
            </View> 
            <TextInput
                style={styles.textplace}
                placeholder='Password'
                type='password'
                password={true}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => this.setState({password: text})}
            />
            
            
            <Button
                large
                icon={{name: 'save', type: 'material', color:'#fff' }}
                title='LOGIN' 
                buttonStyle={styles.but}
                onPress={()=>{this.onSubmit()}}
                />
                <Button
                color='#fff'
                icon={{name: 'arrow-left', type: 'octicon', color:local_color.MAIN }}
                title='Forgot Username or Password?' 
                textStyle={{color:local_color.MAIN}}
                buttonStyle={styles.butlink}
                onPress={()=>{this.props.navigation.navigate('RegisterScreen')}}
                />
              <Button
                color='#fff'
                icon={{name: 'arrow-left', type: 'octicon', color:local_color.MAIN }}
                title='Register' 
                textStyle={{color:local_color.MAIN}}
                buttonStyle={styles.butlink}
                onPress={()=>{this.props.navigation.navigate('RegisterScreen')}}
                />
       </View>
       </View> : null}
       </View>
   
  );
  }
};

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
  user: state.userReducer
})
export default connect(mapStateToProps, { postUser, getUser, getUse })(LogIn);
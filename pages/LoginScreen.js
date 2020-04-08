import React from 'react';
import {  Button, ButtonGroup } from 'react-native-elements';
import { AsyncStorage, TextInput, View, Text, StyleSheet, Alert } from 'react-native';
import * as Font from 'expo-font';
import { connect }from 'react-redux';
import GoogleScreen from './GoogleScreen';
import FacebookScreen from './FacebookScreen';
import { postUser, getUser, getUse, getUserOne } from './actions/User';


import { DB_PATH } from './actions/Common';

const db = DB_PATH;
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
    isActive:false,
    selectedIndex:null
  }
  
  async componentDidMount() {
    this.props.getUserOne();
    this.setState({isActive: await this.props.user.isActive});
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  static getDerivedStateFromProps(nextProps, prevState)
  {
    if(nextProps.user.isActive)
    {
      return{isActive:true}
    }
    return null;
  }

  onSubmit = () =>{
    const { password, email, isActive } = this.state;
    let userx = {
      uniqueid:email,
      passw:password,
      social: 3,
    };
    if(this.state.password)
    {
      this.props.getUser(userx)
        .then(res=>{ 
          AsyncStorage.setItem('user', JSON.stringify(res));
          this.props.navigation.navigate('HomeScreen');
        })
        .catch(err=>{
          Alert.alert('Error', err);
        })
    }
  }

  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });
    if(selectedIndex == 0 )
    {
        this.props.navigation.navigate('ForgotPasswordScreen');
    }
    else if(selectedIndex == 1 )
    {
        this.props.navigation.navigate('RegisterScreen');
    }
  }
  
  comp1 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Forgot Password</Text>
  comp2 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Sign Up</Text>

  render(){
    const { fontLoaded, email, password, selectedIndex, isActive } = this.state;
    const buttons = [{element:this.comp1} , {element:this.comp2}] ;
 
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
                onPress={this.onSubmit}
                />
                
                
       </View>
       </View> : null}
       <ButtonGroup
                  onPress={this.updateIndex}
                  selectedIndex={selectedIndex}
                  buttons={buttons}
                  containerStyle={styles.genButtonGroup1}
                  selectedButtonStyle={styles.genButtonStyle}
                  textStyle={styles.genButtonTextStyle}
                  />
       </View>
   
  );
  }
};

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
  user: state.userReducer
})
export default connect(mapStateToProps, { postUser, getUser, getUse, getUserOne })(LogIn);
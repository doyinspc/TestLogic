import React from 'react';
import { ThemeProvider,  Avatar, Icon, Button } from 'react-native-elements';
import { TextInput, View, Text, StyleSheet,  TouchableHighlight } from 'react-native';

import { connect }from 'react-redux';
import * as Font from 'expo-font';
import { postUser, getUser } from './actions/User';
const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;
const theme = {
  
};


// Your App
class Register extends React.Component{
  state = {
    fontLoaded: false,
    name:'',
    password:'',
    reppassword:'',
    email:'',
    social:3,
    active:1,
    token:'',
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
    const { name, password, email, social,  active, token } = this.state;
    const user = { name, email, uniqueid:email, passw:password, social, active, token };
    if(this.state.password && this.state.password == this.state.reppassword){
        this.props.postUser(user);
    }else{
      this.setState({ error: 'passwords do not match'});
    }

  }

  render(){
    const { fontLoaded, name, email, password, reppassword } = this.state;
    return (
      <View style={{flex:1}}>
      {fontLoaded ? <View style={{flex:1}}>
        <View style={styles.topContainer}>
          <Text style={styles.h1}>Register</Text>
          <Text style={styles.h2}>Complete the form below to register, all information are required</Text>
       </View>
       <View style={styles.bottomContainer}>
            <View style={styles.textwidthx}>
              <Text style={styles.label}>Fullname</Text> 
              </View>   
            <TextInput
                style={styles.textplace}
                placeholder='Fullname'
                type='text'
                value={name}
                onChangeText={(text) => this.setState({name: text})}
              />
              <View style={styles.textwidthx}>
              <Text style={styles.label}>Email</Text> 
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
            <View style={styles.textwidthx}>
            <Text style={styles.label}>Repeat Password</Text>
            </View> 
            <TextInput
                style={styles.textplace}
                placeholder='Repeat Password'
                type='password'
                password={true}
                secureTextEntry={true}
                value={reppassword}
                onChangeText={(text) => this.setState({reppassword: text})}
            />
            <Button
                large
                icon={{name: 'save', type: 'material', color:'#fff' }}
                title='REGISTER' 
                buttonStyle={styles.but}
                onPress={()=>{this.onSubmit()}}
                />
              <Button
                color='#fff'
                icon={{name: 'arrow-left', type: 'octicon', color:local_color.MAIN }}
                title='Back to Login' 
                textStyle={{color:local_color.MAIN}}
                buttonStyle={styles.butlink}
                onPress={()=>{this.props.navigation.navigate('LoginScreen')}}
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
export default connect(mapStateToProps, { postUser, getUser })(Register);
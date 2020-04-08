import React, {Component} from 'react';
import * as Google from 'expo-google-app-auth'
import { Button, SocialIcon } from 'react-native-elements';
import { View,  StyleSheet } from 'react-native';
import { connect }from 'react-redux';

import { GOOGLE_PATH } from './actions/Common';
import { postUser } from './actions/User';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_size = tools.Sizes;



class GoogleScreen extends Component {
  constructor(props) {
  super(props); 
  this.state = {
      signedIn: false,
      name: null,
      email: '',
      photoUrl: null,
      token: ''
    };
  }

 componentDidMount(){
   if(this.props.user.isActive)
   {
    this.setState({signedIn:true});
   } 
 }

  signIn = async() =>{
     try {
          const result = await Google.logInAsync({
          androidClientId:  GOOGLE_PATH,
          scopes: ['profile', 'email'],
        });
        
        if (result.type === 'success')
        {
          let arr = {};
          arr['name'] = result.user.name;
          arr['uniqueid'] = result.user.id;
          arr['email'] = result.user.email;
          arr['photoUrl'] = result.user.photoUrl;
          arr['social'] = 1;
          arr['active'] = 1;
          arr['token'] = result.accessToken;
          this.props.postUser(arr)
          .then(res =>{
            this.setState({
              name: result.user.name,
              email: result.user.email,
              photoUrl: result.user.photoUrl,
              signedIn: true,
              token: result.accessToken
            })
          })
          .catch(err =>{
            Alert.alert('Error', `Facebook Login Error: ${JSON.stringify(err)}`);
          })
        }else 
        {
          Alert.alert('Error', `Google Login Error:`);
        }
      } catch (e) {
        Alert.alert('Error', `Google Login Error: ${e}`);
      }
    }
  
    
  
    render() {
      const { signedIn } = this.state;
      return (
        <View>
          {signedIn ? 
          () =>{this.props.navigation.navigate('HomeScreen', {'data':this.state}) }:
          <SocialIcon reverse raised  type='google'  onPress={()=>{this.signIn()}} />
          }
        </View>
      );
    }

    
    
    }

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
    user: state.userReducer
  })
export default connect(mapStateToProps, { postUser })(GoogleScreen);
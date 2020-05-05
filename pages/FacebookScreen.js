import React, {Component} from 'react';
import * as Facebook from 'expo-facebook';
import { SocialIcon } from 'react-native-elements';
import { View,  StyleSheet, Alert } from 'react-native';
import { connect }from 'react-redux';

import { FACEBOOK_PATH } from './actions/Common';
import { postUser, getUser } from './actions/User';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_size = tools.Sizes;



class FacebookScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      name: 'Adedoyin Charles',
      email: 'doyinspc2@yahoo.com',
      photoUrl: null,
      token: ''
    };
  }
    

 async componentDidMount(){
   if(this.props.user.isActive)
   {
    this.setState({signedIn:true});
   } 
 }

 relocate = () =>{
  this.props.navigation.navigate('HomeScreen');
 }

  signIn = async() =>{
    try {
        await Facebook.initializeAsync(FACEBOOK_PATH);
        const {
          type,
          token,
          expires,
          permissions,
          declinedPermissions
        } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_PATH, {permissions: ['public_profile'],});
        
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
          let arr = {};
          let result = await response.json();
          arr['name'] = result.user.name;
          arr['uniqueid'] = result.user.id;
          arr['email'] = result.user.email;
          arr['photoUrl'] = result.user.photoUrl;
          arr['social'] = 2;
          arr['active'] = 1;
          arr['token'] = token;
          this.props.postUser(arr)
          .then(res=>{
            this.setState({
              name: result.user.name,
              email: result.user.email,
              photoUrl: result.user.photoUrl,
              signedIn: true,
              token: result.accessToken
            })
          })
          .catch(err=>{
            Alert.alert('Error', `Facebook Login failed to save: ${err}`);
          }) 
        } else {
          Alert.alert('Error', `Facebook Login failed use other options`);
        }
      } catch ({ message }) {
        Alert.alert('Error', `Facebook Login Error: ${message}`);
      }
      this.props.onLog(arr);
    }
  
    
  
    render() {
      const { signedIn } = this.state;
      return (
        <View>
         <SocialIcon reverse raised  type='facebook'  onPress={()=>{this.signIn()}} />
        </View>
      );
    }

    
    
    }

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
    user: state.userReducer
  })
export default connect(mapStateToProps, { postUser, getUser })(FacebookScreen);
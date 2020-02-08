import React, {Component} from 'react';
import Expo from 'expo';
import * as Google from 'expo-google-app-auth'
import { ThemeProvider,  Avatar, Icon, Button, Alert } from 'react-native-elements';
import { TextInput, View, Text, StyleSheet,  TouchableHighlight } from 'react-native';
import { connect }from 'react-redux';
import * as Font from 'expo-font';
import HomeScreen from './HomeScreen';
const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;
const theme = {
  
};


class GoogleSignin extends Component {
    state = {
      signedIn: false,
      name: null,
      email: '',
      photoUrl: null,
      token: ''
    };



    signIn = async() =>{
     
     try {
          const result = await Google.logInAsync({
          androidClientId: '159610177254-5euec0rreq4qhhuekm83tbe8tfcrqjsj.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
        });
        
        if (result.type === 'success') {
          console.log(result);
          this.setState({
            name: result.user.name,
            email: result.user.email,
            photoUrl: result.user.photoUrl,
            signedIn: true,
            token: result.accessToken
          })
        } else {
          return { cancelled: true };
        }
      } catch (e) {
        return { error: true };
      }
    }
  
    
  
    render() {
      const { signedIn } = this.state;
      return (
        <View style={styles.container}>
          {signedIn ? this.props.navigation.navigate('HomeScreen', {'data':this.state}) :
          <Button 
            title='LogIn with Google'
            style={{marginHorizontal:5}}
            onPress={()=>{this.signIn()}}
          />
          }
        </View>
      );
    }

    
    
    }

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
    user: state.userReducer
  })
export default connect(mapStateToProps)(GoogleSignin);
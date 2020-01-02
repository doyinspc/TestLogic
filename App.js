import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, createDrawerNavigator} from 'react-navigation-stack';
import { DrawerItems } from 'react-navigation-drawer';
import { Provider }from 'react-redux';
import store from "./store";
import * as Font from 'expo-font';

import HomeScreen from './pages/HomeScreen';
import RegisterScreen from './pages/RegisterScreen';
import LoginScreen from './pages/LoginScreen';
import SubjectScreen from './pages/SubjectScreen';
import ThemeScreen from './pages/ThemeScreen';
import TopicScreen from './pages/TopicScreen';
import ChangePasswordScreen from './pages/ChangePasswordScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import TestSettingsScreen from './pages/TestSettingsScreen';
import TestScreen from './pages/TestScreen';
import ScoresScreen from './pages/ScoresScreen';
import ScoreSheetScreen from './pages/ScoreSheetScreen';
import ScoreScreen from './pages/ScoreScreen';
import QuestionScreen from './pages/QuestionScreen';



const bgColor = '#003B46';
const tintColor  ='#f4f4f4';
const pgArr = { backgroundColor: bgColor }
const phArr = { fontFamily: 'PoiretOne',   color: 'white', justifyContent : 'center', alignItems:'center' }
const cname = 'TestXpo : ';
const AppStack = createStackNavigator({

  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      title: `${cname }Home`,
      icon: 'home',
      headerStyle: pgArr,
      headerTitleStyle: phArr,
      headerTintColor: tintColor,
    },
  },
  RegisterScreen: {
    screen: RegisterScreen,
    navigationOptions: {
      title: 'Register',
      icon: 'home',
      headerStyle: { backgroundColor: 'black' },
      headerTitleStyle: phArr,
      headerTintColor: 'white',
    },
  },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      title: 'Login',
      icon: 'home',
      headerStyle: { backgroundColor: 'black' },
      headerTitleStyle: phArr,
      headerTintColor: 'white',
    },
  },
  ChangePasswordScreen: {
    screen: ChangePasswordScreen,
    navigationOptions: {
      title: 'Change Password',
      icon: 'home',
      headerStyle: { backgroundColor: 'black' },
      headerTitleStyle: phArr,
      headerTintColor: 'white',
    },
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: {
      title: 'Forgot Password',
      icon: 'home',
      headerStyle: { backgroundColor: 'black' },
      headerTintColor: 'white',
    },
  },
  SubjectScreen: {
    screen: SubjectScreen,
    navigationOptions: {
      title: 'Subjects',
      headerStyle: pgArr,
      headerTitleStyle: phArr,
      headerTintColor: tintColor,
    },
  },
  ThemeScreen: {
    screen: ThemeScreen,
    navigationOptions: {
      title: 'Themes',
      headerStyle: pgArr,
      headerTitleStyle: phArr,
      headerTintColor: tintColor,
    },
  },
  TopicScreen: {
      screen: TopicScreen,
      navigationOptions: {
        title: 'Topics',
        headerStyle: pgArr,
        headerTitleStyle: phArr,
        headerTintColor: tintColor,
      },
    },
    TestSettingsScreen: {
      screen: TestSettingsScreen,
      navigationOptions: {
        title: 'Settings',
        headerStyle: pgArr,
        headerTitleStyle: phArr,
        headerTintColor: tintColor,
      },
    }, 
   TestScreen: {
      screen: TestScreen,
      navigationOptions: {
        title: 'Tests',
        headerStyle: pgArr,
        headerTitleStyle: phArr,
        headerTintColor: tintColor,
      },
    },
  QuestionScreen: {
      screen: QuestionScreen,
      navigationOptions: {
        title: 'Questions',
        headerStyle: pgArr,
        headerTitleStyle: phArr,
        headerTintColor: tintColor,
      },
    },
    ScoresScreen: {
      screen: ScoresScreen,
      navigationOptions: {
        title: 'Scores',
        headerStyle: pgArr,
        headerTitleStyle: phArr,
        headerTintColor: tintColor,
      },
    },
    ScoreSheetScreen: {
      screen: ScoreSheetScreen,
      navigationOptions: {
        title: 'Scores',
        headerStyle: pgArr,
        headerTitleStyle: phArr,
        headerTintColor: tintColor,
      },
    },
    ScoreScreen: {
      screen: ScoreScreen,
      navigationOptions: {
        title: 'Score',
        headerStyle: pgArr,
        headerTitleStyle: phArr,
        headerTintColor: tintColor,
      },
    },
  
});

const AppContainer = createAppContainer(AppStack);



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }
  
  async componentDidMount(){
    await Font.loadAsync({
      'PoiretOne': require("./assets/fonts/PoiretOne-Regular.ttf"),
      'SulphurPoint': require("./assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("./assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }
  render() {
    return (
      
      <Provider store={store}>
        { this.state.fontLoaded ? <AppContainer />   :  null  }
      </Provider>
    );
  }
} 


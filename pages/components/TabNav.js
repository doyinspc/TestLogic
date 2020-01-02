import React from 'react';  
import {StyleSheet, Text, View} from 'react-native';  
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';  
import Icon from 'react-native-vector-icons/Ionicons';  

import HomeScreen from './../HomeScreen';
import SubjectScreen from './../SubjectScreen';
 
  
const TabNavigator = createBottomTabNavigator(  
    {  
      Home:{  
        screen:HomeScreen,  
        navigationOptions:{  
          tabBarLabel:'Home',  
          tabBarIcon:({tintColor})=>(  
              <Icon name="ios-home" color={tintColor} size={25}/>  
          )  
        }  
      },  
      Profile: {  
        screen:SubjectScreen,  
        navigationOptions:{  
          tabBarLabel:'Profile',  
          tabBarIcon:({tintColor})=>(  
              <Icon name="ios-person" color={tintColor} size={25}/>  
          )  
        }  
      },  
    },  
    {  
      initialRouteName: "Home"  
    },  
);  

  
export default TabNav = createAppContainer(TabNavigator);  
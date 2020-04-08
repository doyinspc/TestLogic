import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View, 
  TouchableOpacity
} from 'react-native';

import { StackNavigator } from  'react-navigation';
import IOSIcon from "react-native-vector-icons/Ionicons";
import HomeScreen from "./../HomeScreen";
import SubjectScreen from "./../SubjectScreen";
import MockScreen from "./../MockScreen";
import ResourcesScreen from "./../ResourcesScreen";
const stackNav = StackNavigator({
  Home : {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      title: "Home",
      headerLeft:(<TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
                    <IOSIcon name="ios-menu" size={30} />
                  </TouchableOpacity>
      ),
      headerStyle: { paddingRight: 10, paddingLeft: 15 }
    })
  },
  Subject: {
    screen: SubjectScreen,
    navigationOptions: ({navigation}) => ({
      title: "Subject",
    })     
  },
  Mock: {
    screen: MockScreen,
    navigationOptions: ({navigation}) => ({
      title: "Mock Test",
    })     
  },
  Resources: {
    screen: ResourcesScreen,
    navigationOptions: ({navigation}) => ({
      title: "Resources",
    })     
  }
});

export default stackNav;
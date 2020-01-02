import React, { Component } from 'react'
import { View, Switch, StyleSheet }

from 'react-native'
export default class SwitchSet extends Component{
   render(){
      return (
         <View style = {styles.container}>
            <Switch
               onValueChange = {this.props.toggleSwitch1}
               value = {this.props.switch1Value}/>
         </View>
      )
   }
}

const styles = StyleSheet.create ({
   container: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent:'center',
      marginTop: 0
   }
})
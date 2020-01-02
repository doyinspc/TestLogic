import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native'

class Pickers extends Component {
   render() {
      const {data, val, valueChange} = this.props;
      return (
         <View>
            <Picker selectedValue = {val} onValueChange = {valueChange}>
               <Picker.Item key={90} label = 'Select' value = {0} />
               {data.map((l)=>(<Picker.Item key={l.id} label = {l.name} value = {l.id.toString()} />))}
            </Picker>
         </View>
      )
   }
}
export default Pickers

const styles = StyleSheet.create({
   text: {
      fontSize: 30,
      alignSelf: 'center',
      color: 'red'
   }
})
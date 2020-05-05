import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Button, Icon } from 'react-native-elements';
const tools = require('./Style');
const local_style = tools.Style;
const local_color = tools.Colors;
// Your App
export default function Activity(props) {
  return (
    <View style={{flex:1, alignContent:'center', justifyContent:'center'}}>
    
    <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
        <ActivityIndicator
        color = {local_color.Colors}
        size = "large"
        />
<Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', marginHorizontal:10, padding:5, alignContent:'center'}}>{`${props.title} Loading... Please wait..`}</Text>
    </View>
    
  </View>
  );
};

const styles = StyleSheet.create (local_style);
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
const tools = require('./Style');
const local_style = tools.Style;
const local_color = tools.Colors;
// Your App
export default function Activity(props) {
  return (
    <View style={{flex:1}}>
    <ActivityIndicator
        color = {local_color.Colors}
        size = "large"
        />
    <Text>{`${props.title} Loading.. Please wait..`}</Text>
    <Text>or work offline</Text>
    <Button 
    title="Offline" 
    buttonStyle={styles.but}
    onPress={()=>{props.onPress(1)}}
    />
  </View>
  );
};

const styles = StyleSheet.create (local_style);
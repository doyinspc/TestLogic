import React, { Component } from 'react'
import {
   View,
   TouchableOpacity,
   TouchableHighlight,
   Text,
   StyleSheet
} from 'react-native'
import WebView from 'react-native-webview';

export default OptionsButton = (props) => {
   const onPress = (a, b) =>{
      props.handlePress(a, b);
   }
   return (
      <View style = {styles.container}>
         { parseInt(props.tim) === 1 ? 
         <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#ffffff"
            onPress={props.isCompleted ? null : ()=>onPress(props.activeNumber, props.optionID)}
            disable={props.disable}
            >
               <WebView 
                    originWhitelist={['*']}
                    source={{ html: props.option }}
                    scalesPageToFit={false}
                    style={ props.status  === 1 ? styles.buttonSelect : styles.button }
                    scrollEnabled={false}
                    disable={props.disable}
               /> 
         </TouchableHighlight>
         : null}
      
      { parseInt(props.tim) === 2 ? 
         <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#ffffff"
            onPress={(props.status  === 1 || props.status  === 2) || props.isCompleted ? null : ()=>onPress(props.activeNumber, props.optionID)}
            disable={props.disable}
            >
               <WebView 
                    originWhitelist={['*']}
                    source={{ html: props.option }}
                    scalesPageToFit={false}
                    style={ props.status  === 1 ? styles.buttonPass : props.status  === 2 ? styles.buttonFail : styles.button }
                    scrollEnabled={false}
                    disable={props.disable}
               /> 
         </TouchableHighlight>
         : null}

      { parseInt(props.tim) === 3 ? 
         <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#ffffff"
            onPress={ props.isCompleted ? null : ()=>onPress(props.activeNumber, props.optionID) }
            disable={props.disable}
            >
               <WebView 
                    originWhitelist={['*']}
                    source={{ html: props.option }}
                    scalesPageToFit={false}
                    style={ props.status  === 1 ? styles.buttonSelect : styles.button }
                    scrollEnabled={false}
                    disable={props.disable}
               /> 
         </TouchableHighlight>
         : null}
      </View>
   )
}

const styles = StyleSheet.create ({
   container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  button: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#DDDDDD",
    padding: 10,
    fontFamily:'SulphurPoint',
    minHeight:50
  },
  buttonSelect: {
   alignItems: "center",
   alignSelf: "stretch",
   backgroundColor: "#679267",
   padding: 10,
   fontFamily:'SulphurPoint',
   minHeight:50
 },
  buttonPass: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#50c878",
    color:"white",
    padding: 10,
    fontFamily:'SulphurPoint',
    minHeight:50
  },
  buttonFail: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#FFCCCB",
    color:"white",
    padding: 10,
    fontFamily:'SulphurPoint',
    minHeight:50
  },
  buttonDisable: {
   alignItems: "center",
   alignSelf: "stretch",
   backgroundColor: "#DC143C",
   color:"white",
   padding: 10,
   fontFamily:'SulphurPoint',
   minHeight:50
 },
})
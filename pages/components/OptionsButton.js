import React, { Component } from 'react'
import {
   View,
   TouchableOpacity,
   TouchableHighlight,
   Text,
   StyleSheet
} from 'react-native'
import WebView from 'react-native-webview';
const tools = require('./Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

export default OptionsButton = (props) => {
   const onPress = (a, b) =>{
      props.handlePress(a, b);
   }
   //SHOW ANSWERS OPTION
   let text_data = '';
   let text_button= styles.buttonSelect;
   console.log('answer for'+props.disable+' '+JSON.stringify(props.answer)+' '+props.choice+' '+props.isCompleted);
   if(parseInt(props.ans) === 1  || props.isCompleted)
   {
      //SHOW ANSWERS ON SELECTION
      if(props.disable || (!props.disable && props.isCompleted === true))
      {
         //QUESTION ALREADY ANSWERED
         //CONFIRM OPTION
         if(props.answer === props.optionID)
         {
            //IT IS THE CORRECT OPTION
            //GREEN
            if(props.answer === props.choice)
            {
               text_data = '<b style="color:white;width:auto; padding:2px; margin:1px">'+props.option+' ok</b>';
            }else
            {
               text_data = '<b style="color:white;width:auto; padding:2px; margin:1px">'+props.option+' </b>';
            }
            
            text_button = styles.buttonGreen;
         }
         else
         {
            //IT IS THE WRONG OPTION
            //RED
            if(props.answer !== props.choice)
            {
               text_data = '<b style="color:white;width:auto; padding:2px; margin:1px">'+props.option+' wrong</b>';
            }else
            {
               text_data = '<b style="color:white;width:auto; padding:2px; margin:1px">'+props.option+' </b>';
            }
            text_button = styles.buttonRed;
         }
      }
      else
      {
         //QUESTION NOT ANSERED
         //GREY
         text_data = props.option;
         text_button = styles.buttonGrey;

      }

   }
   if(parseInt(props.ans) === 2 && !props.isCompleted)
   {
      if(props.disable)
      {
         if(props.optionID === props.choice)
         {
            text_data = '<b style="color:white;width:auto; padding:2px; margin:1px">'+props.option+' </b>';
            text_button = styles.buttonBlue;
         }else
         {
            text_data = props.option;
            text_button = styles.buttonGrey;
         } 
      }
      else{
         text_data = props.option;
         text_button = styles.buttonGrey;
      }

   }

   return (
      <View style = {styles.container}>

         { parseInt(props.ans) === 2 || parseInt(props.ans) ===  1 ? 
         <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#ffffff"
            onPress={props.disable || props.isCompleted === true ? null : ()=>onPress(props.activeNumber, props.optionID)}
            disable={props.disable}
            >
               <WebView 
                    originWhitelist={['*']}
                    source={{ html: text_data }}
                    scalesPageToFit={false}
                    style={ text_button }
                    scrollEnabled={false}
                    disable={props.disable}
               /> 
         </TouchableHighlight>
         : null}
      
      

      { parseInt(props.ans) === 3 ? 
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
    paddingHorizontal: 10,
    width: 300,
  },
  button: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#DDDDDD",
    padding: 10,
    fontFamily:'SulphurPoint',
    minHeight:50,
    width: Math.floor(local_size.WIDTHS * 0.8),
  },
  buttonGreen: {
   alignItems: "center",
   alignSelf: "center",
   backgroundColor: "green",
   padding: 10,
   fontFamily:'SulphurPoint',
   minHeight:50,
   width: Math.floor(local_size.WIDTHS * 0.8),
   color: '#ffffff',
 },
 buttonBlue: {
   alignItems: "center",
   alignSelf: "center",
   backgroundColor: "blue",
   padding: 10,
   fontFamily:'SulphurPoint',
   minHeight:50,
   width: Math.floor(local_size.WIDTHS * 0.8),
   color: '#ffffff',
 },
 buttonRed: {
   alignItems: "center",
   alignSelf: "center",
   backgroundColor: "red",
   padding: 10,
   fontFamily:'SulphurPoint',
   minHeight:50,
   color: '#ffffff',
   width: Math.floor(local_size.WIDTHS * 0.8),
   height: 50,
   fontSize:14,
 },
 buttonGrey: {
   alignItems: "center",
   alignSelf: "center",
   backgroundColor: "#f1f1f1",
   padding: 10,
   fontFamily:'SulphurPoint',
   width: Math.floor(local_size.WIDTHS * 0.8),
   minHeight:50,
   color: '#ffffff',
 },
  buttonSelect: {
   alignItems: "center",
   alignSelf: "center",
   backgroundColor: "#f9fccc",
   padding: 10,
   fontFamily:'SulphurPoint',
   width: Math.floor(local_size.WIDTHS * 0.8),
   minHeight:50,
   color: '#ffffff',
 },
  buttonPass: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#50c878",
    color:"white",
    padding: 10,
    fontFamily:'SulphurPoint',
    minHeight:50,
    color: '#ffffff',
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
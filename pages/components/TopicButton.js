import React, { Component } from 'react';
import {
   View,
   TouchableOpacity,
   TouchableHighlight,
   Text,
   StyleSheet
} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
const tools = require('./Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

export default TopicButton = (props) => {
   const onPress = (a, b) =>{
      props.handlePress(a, b);
   }
   return (
      <View style={{flex:1}}>
            <TouchableHighlight
              key={props.key}
              activeOpacity={0.6}
              underlayColor="#ffffff"
              onPress={()=>{onPress()}}
              style={{marginVertical:1, color:'#ffffff', fontSize:14, fontFamily:'SulphurPoint', minHeight:60, backgroundColor:'teal'}}
            >
              <View style={{flexDirection:'row', paddingHorizontal:15 , paddingVertical:5}}>
               <Avatar overlayContainerStyle={{backgroundColor: props.active == 2 ? 'grey' : props.checked ? 'skyblue' : local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: props.active == 2 ? 'cloud-download':props.checked ? 'done' :'school', color:'white', backgroundColor:'red' }} />
                <Icon name='cloud-download' color='white' type='material' size={30} style={{padding:20}} />
                <Text key={props.id} style={{color:'#ffffff', fontSize:14, fontFamily:'SulphurPoint', padding:20}}>{props.name}</Text>
             </View>
         </TouchableHighlight>
         </View>
   )
}

const styles = StyleSheet.create ({
   container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  button: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#00000f",
    padding: 10,
    fontFamily:'SulphurPoint',
    height:50
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
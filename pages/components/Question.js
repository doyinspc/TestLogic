import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import WebView from 'react-native-webview';


export default class Question extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
        }
    }
  
  render() {

    return (
       <View style={styles.row}>
              <WebView 
              originWhitelist={['*']}
              source={{ html: this.props.data }}
              scalesPageToFit={false}
              style={{minHeight:90}}
              scrollEnabled={false}
            /> 
       </View>
    )
  }

  toggleExpand=()=>{
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    title:{
        fontSize: 14,
        fontWeight:'bold',
        color: 'gray',
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        minHeight: 70,
        paddingLeft:5,
        paddingRight:5,
        alignItems:'center',
    },
    parentHr:{
        height:1,
        color: 'white',
        width:'100%'
    },
    child:{
        backgroundColor: '#ffffff',
        padding:5,
    }
    
});
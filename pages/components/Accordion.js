import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import WebView from 'react-native-webview';
import * as Font from 'expo-font';
export default class Accordian extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
          fontLoaded: false
        }
    }

    async componentDidMount() {
      await Font.loadAsync({
        'SulphurPoint': require("../../assets/fonts/SulphurPoint-Bold.ttf"),
        'SulphurPointNormal': require("../../assets/fonts/SulphurPoint-Regular.ttf")
      });
      this.setState({ fontLoaded: true });
    }
  
  render() {

    return (
       <View style={{margin:0}}>
            <TouchableOpacity style={styles.row} onPress={()=>this.toggleExpand()}>
                <Text style={styles.title}>{this.props.title && this.props.title.length ? this.props.title : 'Read'}</Text>
                <Icon name={this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color='#ffffff' />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={styles.child}>
                    <WebView 
                    originWhitelist={['*']}
                    source={{ html: this.props.data }}
                    scalesPageToFit={false}
                    style={{minHeight:300, height:'auto'}}
                    scrollEnabled={false}
                  /> 
                </View>
            }
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
        color: '#fff',
        fontFamily:'SulphurPointNormal',
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        minHeight: 50,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: '#000000',
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
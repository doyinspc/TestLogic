import React, { Component } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


class ProgressCircular extends Component{
   render(){
      return (
         <View style = {styles.container}>
            <AnimatedCircularProgress
                size={120}
                width={15}
                fill={this.props.prog}
                tintColor="#00e0ff"
                onAnimationComplete={this.props.onDownloaded()}
                backgroundColor="#3d5875" />
         </View>
      )
   }
}

const styles = StyleSheet.create ({
   container: {
      flex: 1,
      justifyContent:'center',
      marginTop: 0
   }
})
export default ProgressCircular;
 

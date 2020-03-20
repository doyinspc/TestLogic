import React, { Component } from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


class ProgressCircular extends Component{
   constructor(props) {
      super(props);
      this.state = {
        prog:props.prog
      };
    }

    componentDidUpdate(nextProps, prevState){
       if(nextProps.prog !== prevState.prog)
       {
          this.setState({prog:nextProps.prog})
       }

    }
   render(){
      return (
         <View style = {styles.container}>
            <AnimatedCircularProgress
                size={300}
                width={25}
                fill={ this.state.prog }
                tintColor={this.props.prog < 100 ? "#aeefc1": "#00e0ff"}
                onAnimationComplete={this.props.onDownloaded}
                backgroundColor="#3d5875"
                 >

                {this.props.prog == 100 ? 
                  (fill) => (
                     <View >
                     <Text style={{fontFamily:'PoiretOne', fontSize:70}}>
                      { `${this.props.prog}%` }
                     </Text>
                     <Text style={{fontFamily:'SulphurPointNormal', fontSize:20, alignSelf:'center', alignContent:'center'}}>
                     { `Downloaded` }
                    </Text>
                    </View>
                  ) :
                  (fill) => (
                     <View >
                     <Text style={{fontFamily:'PoiretOne', fontSize:70}}>
                      { `${this.props.prog}%` }
                     </Text>
                     <Text style={{fontFamily:'SulphurPointNormal', fontSize:10, alignSelf:'center', alignContent:'center'}}>
                     { `Downloading.. Please wait` }
                    </Text>
                    </View>
                  )
                }

            </AnimatedCircularProgress>
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
 

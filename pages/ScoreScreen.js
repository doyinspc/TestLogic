import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Button, Avatar, ListItem, PricingCard } from 'react-native-elements';


import * as Font from 'expo-font';
import Activity from './components/Loader';

import { getScores } from './actions/Score';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;


// Your App
class ScoresScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  relocate = (value) =>{
    if(value && value > 0)
    {
     this.props.navigation.navigate('ScoreScreen', {'scoreID':value})
    }
  }
 
  async componentDidMount() {
    this.props.getScores(JSON.stringify(this.props.navigation.getParam('testID')));
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

 

render(){
 const { score, test, isLoading } = this.props;
 const { fontLoaded } = this.state;
 const { title, scored, info }  = score;
  return (
    <ThemeProvider >
       {!fontLoaded  ?  
        <Activity title='Scores' onPress={()=>{this.onPress(1)}} />:
        <View style={{flex: 1, justifyContent:'center'}}>
           <PricingCard
            color="#4f9deb"
            title={`Test 23454`}
            price='96%'
            info={['30 Question Passed','3 Questions failed', '0 questions unanswered', 'Ha more details shu']}
            button={{ title: 'View Performance', icon: 'flight-takeoff' }}
            />
        </View> }  
    </ThemeProvider>
  );
};
}

const styles = StyleSheet.create(local_style)

const mapStateToProps = state => ({ 
  score: state.scoreReducer,
  test: state.testReducer
})
export default connect(mapStateToProps,{ getScores })(ScoresScreen);
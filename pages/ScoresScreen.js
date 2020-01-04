import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Button, Avatar, ListItem } from 'react-native-elements';
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
    //JSON.stringify(this.props.navigation.getParam('testID'));
    this.props.getScores(14);
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

 

render(){
 const { score, isLoading } = this.props;
 const { fontLoaded } = this.state;
 console.log(score);
  return (
    <ThemeProvider >
       {fontLoaded  ?   
       <View style={{flex: 1}}>
          <ScrollView>
            {
            score.scores.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.title}
                subtitle={l.timeleft}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocate(l.id)}}
                badge={{  value: `${Math.floor(l.score * 100) > 0 ? Math.floor(l.score * 100) : 'Paused..'}%` , textStyle: { color: 'white', backgroundColor:local_color.MAIN, borderRadius:20 }, containerStyle: { marginTop: 1 } }}
                chevron
            />
            ))
            }
         </ScrollView>
        </View>: <Activity title='Scores' onPress={()=>{this.onPress(1)}} /> }  
    </ThemeProvider>
  );
};
}

const styles = StyleSheet.create(local_style)

const mapStateToProps = state => ({ 
  score: state.scoreReducer
})
export default connect(mapStateToProps,{ getScores })(ScoresScreen);
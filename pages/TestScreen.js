import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Button, Avatar, ListItem } from 'react-native-elements';
import * as Font from 'expo-font';
import Activity from './components/Loader';

import { getTests } from './actions/Test';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;


// Your App
class TestScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

  relocate = (value) =>{
    if(value && value > 0)
    {
     this.props.navigation.navigate('TestSheetScreen', {'testID':value})
    }
  }
 
  async componentDidMount() {
    this.props.getTests(JSON.stringify(this.props.navigation.getParam('subjectID')));
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

 

render(){
 const { test, isLoading } = this.props;
 const { fontLoaded } = this.state;

  return (
    <ThemeProvider >
       {!fontLoaded  ?  
        <Activity title='Test' onPress={()=>{this.onPress(1)}} />:
       <View style={{flex: 10}}>
          <ScrollView>
            {
            test.tests.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.title}
                subtitle={`${l.settings.split(':::')[0]} Questions`}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocate(l.id)}}
                badge={{  value: l.id, textStyle: { color: 'white', backgroundColor:local_color.MAIN, borderRadius:20 }, containerStyle: { marginTop: 1 } }}
                chevron
            />
            ))
            }
         </ScrollView>
        </View> }  
    </ThemeProvider>
  );
};
}

const styles = StyleSheet.create(local_style)

const mapStateToProps = state => ({ 
  test: state.testReducer
})
export default connect(mapStateToProps,{ getTests })(TestScreen);
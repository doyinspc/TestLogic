import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, Button } from 'react-native-elements';
import * as Font from 'expo-font';

import { getSubjectsCloud, getSubjects , getSubjectsClear} from './actions/Subject';
import { getThemes } from './actions/Theme';
import Activity from './components/Loader';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class SubjectScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false
    };
  }

 relocate = id =>{
  this.props.navigation.navigate('ThemeScreen', {id:id})
 }

 async componentDidMount() {
  this.props.getSubjects();

  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });

  this.setState({ fontLoaded: true });
}

 updateSubjects =()=>{
  this.props.getSubjectsCloud();
}

 

render(){
  const { subjects, isLoading } = this.props.subject;
  const { fontLoaded } = this.state;
  return (
    <ThemeProvider >
        {isLoading ?  
        <Activity title='Subject' onPress={()=>{this.onPress(1)}} />:
        <View>
        {fontLoaded && subjects  && Object.keys(subjects).length > 0 ?
            subjects.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: local_color.color3}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocate(l.id)}}
                chevron
                badge={{  value: 457, textStyle: { color: 'white', backgroundColor:local_color.MAIN, borderRadius:20 }, containerStyle: { marginTop: 1 } }}
            />
            ))
        : null}
        </View>}
        <View style={{flex: 1}}>
        <Button 
              buttonStyle={styles.but}
              title='UPDATE ALL'
              onPress={()=>{this.updateSubjects()}}
              />
           
           </View>
    </ThemeProvider>
  );
};
}

const styles = StyleSheet.create(local_style);

const mapStateToProps = state => ({ 
  subject: state.subjectReducer
})
export default connect(mapStateToProps, 
  { 
    getSubjects, 
    getSubjectsCloud,
    getSubjectsClear,
    getSubjects,
    getThemes
  
  })(SubjectScreen);
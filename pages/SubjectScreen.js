import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';

import { getSubjectsCloud, getSubjects , getSubjectsClear, getSubjectOne} from './actions/Subject';
import Activity from './components/LoaderTest';

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class SubjectScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      selectedIndex: null
    };
  }

 async componentDidMount() {
  this.props.getSubjects();
  this.props.getSubjectsCloud();
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true });
}

relocate = (value) =>{
  if(value && value > 0)
  {
    this.props.getSubjectOne(value);
    this.props.navigation.navigate('ThemeScreen', {'subjectID':value})
  }
}

updateSubjects =()=>{
  this.props.getSubjectsCloud();
}

updateIndex = (selectedIndex) =>{
  this.setState({ selectedIndex });
  if(selectedIndex == 0 )
  {
      this.props.navigation.navigate('HomeScreen');
  }
  else if(selectedIndex == 1 )
  {
      this.updateSubjects()
  }
 
}

comp1 = () => <Icon name='home' color='white' type='material' />
comp2 = () => <Icon name='cloud-download' color='white' type='material' />

render(){
  const { subjects, isLoading } = this.props.subject;
  const { fontLoaded, selectedIndex } = this.state;
  const buttons = [{element:this.comp1}, {element:this.comp2}];

  return (
    
    <ThemeProvider >
      <View style={styles.topSection}>
          <Text style={styles.h1}>Subjects</Text>
          <Text style={styles.h2}>Pick a subject</Text>
      </View>
      <View style={{flex:1}}>
        {fontLoaded  && !isLoading ?  
         <ScrollView>
         {subjects  && Object.keys(subjects).length > 0 ?
            subjects.map((l, i) => (
            <ListItem
                key={i}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocate(l.id)}}
                chevron
                badge={{  value: 457, textStyle: { color: 'white', backgroundColor:local_color.color1, padding:4, borderRadius:20, fontFamily:'PoiretOne' }, containerStyle: { marginTop: 10 } }}
            />
            ))
        : 
        <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
          <Icon name='cloud-download' type='material' size={70} color={local_color.color1} />
          <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Download Subjects</Text>
        </View>
          }
        </ScrollView>:<Activity title='Subject' onPress={()=>{this.onPress(1)}} />}
           <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={styles.genButtonGroup}
            selectedButtonStyle={styles.genButtonStyle}
            textStyle={styles.genButtonTextStyle}
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
    getSubjectOne
  
  })(SubjectScreen);
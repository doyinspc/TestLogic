import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import Admob from "./advert/Admob";
import Adinter from "./advert/Adinter";

import { getResourcesDownload, getResourceSelected} from './actions/Resource';
import Activity from './components/LoaderTest';


const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;



class ResourceScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      showAlert: false,
      selectedIndex: null,
      page:1,
      checked: {},
      values: []
    };
  }

 
 
  async componentDidMount() {
    this.props.getResourcesDownload(this.props.navigation.getParam('topicID'));
    var page = this.props.navigation.getParam('sid');
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true , page:page});
  }

  
  //REDIRECT TO TOPIC SCREEN : RESOURCES
  //ARGUMENTS PASSED THE RESOURCE IDS SELECTED
  relocateOne = (id) =>{
    let values = id;
    if(values)
    {
      var arr = []
      this.props.navigation.navigate('ResourceScreen', {'resourceID':values, 'sid':this.state.page})
    }
  }
  
  //DOWNLOAD RESOURCES FROM HOME/ONLINE SERVER
  //ARGUMENT PASSED SUBJECT ID
  updateResource =(subject)=>{
    this.props.getResourcesDownload(subject, (response)=>{
    });
  }

  //GET SELECTED TOPICS AND STORE THEM IN STATE VALUES
 onChange = e => {
   let news = {...this.state.checked};
   news[e] = news[e] ? false : true;
   this.setState({checked : news});
   const currentIndex = this.state.values.indexOf(e);
   const newValues = [...this.state.values];
 
   if (currentIndex === -1) {
     newValues.push(e);
   } else {
     newValues.splice(currentIndex, 1);
   }
   this.setState({values:newValues});
 }

 //BOTTOM NAVIGATION
 //.0 REDIRECT TO HOME PAGE
 //.1 VALUE SELECTED : REDIRECT TO TOPICS
 //.2 VALUE NOT SELECTED : DOWNLOAD FUNCTION
 //.3. ONLY WHEN VALUE IS SELECTED : DOWNLOAD
 updateIndex = (selectedIndex) =>{
  this.setState({ selectedIndex });
  if(selectedIndex == 0 )
  {
      this.props.navigation.navigate('HomeScreen');
  }
  else if(selectedIndex == 1 )
  {
    var p = this.state.page == 1 ? 2 : 1;
    this.setState({page:p});
  }
  else if(selectedIndex == 2 )
  {
      const subs = JSON.stringify(this.props.navigation.getParam('topicID'));
      this.updateResource(subs)
  }
  else if(selectedIndex == 3 )
  {
    if(this.state.values.length > 0)
    {
      this.relocate();
    }  
  }

 
}

comp1 = () => <Icon name='home' color='white' type='material' />
comp2 = () => <Icon name={ this.state.page == 1 ? 'book' : 'spellcheck'} color='white' type='material' />
comp3 = () => <Icon name='cloud-download' color='white' type='material' />
comp4 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Next</Text>


render(){
 const { resources, isLoading } = this.props.resource;
 const { name } = this.props.subject.subject;
 const { fontLoaded, selectedIndex, values, page } = this.state;
 const buttons = values && Object.keys(values).length > 0 && page == 1 ? [{element:this.comp1}, {element:this.comp2}, {element:this.comp3} , {element:this.comp4}] : [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];
 
  return (
    <ThemeProvider >
      <View style={styles.topSection}>
          <Text style={styles.h1}>{name}</Text>
          <Text style={styles.h2}>{page == 1 ? 'Test': `Resources`}: pick at least one resource</Text>
      </View>
      <View style={{flex:1}}>
        {fontLoaded   ?  
         <ScrollView>
            {resources  && Object.keys(resources).length > 0 ? resources.map((l, i) => 
            (<ListItem
              key={i}
              titleStyle={styles.listItem}  
              leftAvatar={ 
                l.type  == 1 ? 
                      <Avatar overlayContainerStyle={{backgroundColor: local_color.color2}} activeOpacity={0.7} color='white' rounded  icon={{ name: 'tv', type:'material', color:local_color.color1, backgroundColor:'red' }} /> 
                      : l.type == 2 ? 
                          <Avatar overlayContainerStyle={{backgroundColor: 'red'}} activeOpacity={0.7}  rounded  icon={{ name: 'delete', color:'white', backgroundColor:'red' }} />
                          : l.type  >= 3  ?  <Avatar overlayContainerStyle={{backgroundColor: 'blue'}} activeOpacity={0.7}  rounded  icon={{ name: 'done', color:'white', backgroundColor:'red' }} />
                            : <Avatar overlayContainerStyle={{backgroundColor:local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: 'done-all', color:'white', backgroundColor:'red' }} />
            }
              title={`${l.title} by ${l.author}`}
              subtitle={l.description}
              titleStyle={styles.listItem}
              subtitleStyle={{fontFamily: 'PoiretOne', color:local_color.color4}}
              bottomDivider
              friction={90}
              tension={100}
              activeScale={0.85}
              onPress={()=>{this.relocateOne(l.id)}}
              chevron
          />
            )           
            )
          :
        <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
          <Icon name='cloud-download' type='material' size={70} color={local_color.color1} />
          <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Download Resources</Text>
        </View>
        }
        </ScrollView>:<Activity title='Resource' onPress={()=>{this.onPress(1)}} />}
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

const styles = StyleSheet.create(local_style)

const mapStateToProps = state => ({ 
  resource: state.resourceReducer,
  topic: state.topicReducer,
  theme: state.themeReducer,
  subject: state.subjectReducer,
  user: state.userReducer
})
export default connect(mapStateToProps, 
  { 
    getResourcesDownload,
    getResourceSelected,
  })(ResourceScreen);
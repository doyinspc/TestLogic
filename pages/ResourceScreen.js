import React from 'react';
import { connect }from 'react-redux';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import { YouTubeStandaloneAndroid } from 'react-native-youtube';
import AwesomeAlert from 'react-native-awesome-alerts';

import { getResource, getResourceSelected, getResourcesDownload} from './actions/Resource';
import { GOOGLE_API_KEY } from './actions/Common';
import Activity from './components/LoaderTest';
import WebView from 'react-native-webview';


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

  //AWESOME ALERT
  //SHOW SELECTED TOPICS
  showAlert = () =>{
    this.setState({showAlert: true});
  }
  hideAlert = () =>{
    this.setState({showAlert: false});
  }
 
  async componentDidMount() {
    this.props.getResource(this.props.navigation.getParam('resourceID'));
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
      this.props.getResourceSelected(arr.push(values));
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
onMessage = (event) => {
  const {title, message} = JSON.parse(event.nativeEvent.data)
  Alert.alert(
    title,
    message,
    [],
    { cancelable: true }
  );
}
comp1 = () => <Icon name='home' color='white' type='material' />
comp2 = () => <Icon name={ this.state.page == 1 ? 'book' : 'spellcheck'} color='white' type='material' />
comp3 = () => <Icon name='cloud-download' color='white' type='material' />
comp4 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Next</Text>


render(){
 const { resource } = this.props.resource;
 const { name } = this.props.subject.subject;
 const { fontLoaded, selectedIndex, values, page } = this.state;
 const buttons = values && Object.keys(values).length > 0 && page == 1 ? [{element:this.comp1}, {element:this.comp2}, {element:this.comp3} , {element:this.comp4}] : [{element:this.comp1}, {element:this.comp2}, {element:this.comp3}];
 let res = resource;
 const params = 'platform='+Platform.OS;
    const sourceUri = (Platform.OS === 'android' ? 'file:///android_asset/' : '') + 'Web.bundle/loader.html';
    const injectedJS = `if (!window.location.search) {
      var link = document.getElementById('progress-bar');
      link.href = './site/index.html?${params}';
      link.click();
    }`;
  return (
    <ThemeProvider >
      <View style={{flex:1}}>
        {fontLoaded   ? 
        <View style={{flex:1}}>
          <View>
            <Text style={styles.h2}>{resource.title}</Text>
            <Text style={styles.h2}>{resource.author}</Text>
          </View> 
            {resource.types == 1 ?
            <View style={{marginTop:2, flex:1}}>
            <ScrollView style={{flex:1}}>
            <WebView  
              source={{ html:[resource.data1, resource.data1] }}
              injectedJavaScript={injectedJS}
              javaScriptEnabled={true}
              originWhitelist={['*']}
              allowFileAccess={true}
              onMessage={this.onMessage}
              style={{marginTop:2, flex:1, height: Math.floor(local_size.HEIGHTS * 80)}}
            />
            </ScrollView>
            </View>
            : null } 
            {resource.types == 2 ?
            <View style={{marginTop:2, flex:1}}>
            <ScrollView style={{flex:1}}>
            <WebView  
              source={{ uri:resource.sources }}
              javaScriptEnabled={true}
              originWhitelist={['*']}
              allowFileAccess={true}
              onMessage={this.onMessage}
              style={{marginTop:2, flex:1, height: Math.floor(local_size.HEIGHTS * 80)}}
            />
            </ScrollView>
            </View>
            : null } 
            {resource.types == 3 ?
            <View style={{marginTop:2, flex:1}}>
            {YouTubeStandaloneAndroid.playVideo({
            apiKey: GOOGLE_API_KEY, // Your YouTube Developer API Key
            videoId: resource.sources, // YouTube video ID
            autoplay: true, // Autoplay the video
            startTime: 120, // Starting point of video (in seconds)
          })
            .then(() => console.log('Standalone Player Exited'))
            .catch(errorMessage => console.error(errorMessage))}
            </View>
            : null }
          
          </View>:<Activity title='Resource' onPress={()=>{this.onPress(1)}} />}
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
    getResource,
    getResourceSelected,
    getResourcesDownload,
  
  })(ResourceScreen);
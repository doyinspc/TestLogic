import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { ThemeProvider, ButtonGroup, Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import WebView from 'react-native-webview';
import AwesomeAlert from 'react-native-awesome-alerts';

import { getMock, getMockSelected, getMocksDownload} from './actions/Mock';
import Activity from './components/LoaderTest';


const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

class MockScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      key:1,
      fontLoaded: false,
      showAlert: false,
      selectedIndex: null,
      page:1,
      checked: {},
      values: []
    };
  }

  //AWESOME ALERT
  //SHOW SELECTED MOCKS
  showAlert = () =>{
    this.setState({showAlert: true});
  }
  hideAlert = () =>{
    this.setState({showAlert: false});
  }
 
  async componentDidMount() {
    this.props.getMock(this.props.navigation.getParam('mockID'));
    var page = this.props.navigation.getParam('sid');
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true , page:page});
  }

  
  //REDIRECT TO MOCK SCREEN : MOCKS
  //ARGUMENTS PASSED THE MOCK IDS SELECTED
  relocateOne = (id) =>{
    let values = id;
    if(values)
    {
      var arr = []
      this.props.getMockSelected(arr.push(values));
      this.props.navigation.navigate('MockScreen', {'mockID':values, 'sid':this.state.page})
    }
  }
  
  //DOWNLOAD MOCKS FROM HOME/ONLINE SERVER
  //ARGUMENT PASSED SUBJECT ID
  updateMock =(subject)=>{
    this.props.getMocksDownload(subject, (response)=>{
    });
  }

  //GET SELECTED MOCKS AND STORE THEM IN STATE VALUES
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
 //.1 VALUE SELECTED : REDIRECT TO MOCKS
 //.2 VALUE NOT SELECTED : DOWNLOAD FUNCTION
 //.3. ONLY WHEN VALUE IS SELECTED : DOWNLOAD
 updateIndex = (selectedIndex) =>{
  this.setState({ selectedIndex });
  if(selectedIndex == 0 )
  {
      this.props.navigation.navigate('MocksScreen', {'topicID': this.props.navigation.getParam('mockID')});
  }
  else if(selectedIndex == 1 )
  {
      const subs = this.props.navigation.getParam('mockID');
      this.updateMock(subs);
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
comp1 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Backward</Text>
comp2 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Reload</Text>
render(){
 const { mock } = this.props.mock;
 const { name } = this.props.subject.subject;
 const { fontLoaded, selectedIndex, values, page } = this.state;
 const buttons =  [{element:this.comp1}, {element:this.comp2}] ;
  return (
    <ThemeProvider >
      <View style={{flex:1}}>
        {fontLoaded   ? 
        <View style={{flex:1}}>
          <View style={{marginHorizontal: Math.floor(local_size.WIDTHS * 0.05) }}>
            <Text style={styles.h2_top}>{`${name} ${mock.title}`}</Text>
            <Text style={styles.h2_top_description}>{mock.description ? mock.description: ''}</Text>
          </View> 
            <View style={{marginTop:2, flex:1}}>
            <ScrollView >
            <WebView 
              source={{ uri:mock.sources }}
              javaScriptEnabled={true}
              originWhitelist={['*']}
              allowFileAccess={true}
              onMessage={this.onMessage}
              style={{marginTop:2, flex:1, minHeight: Math.floor(local_size.HEIGHTS * 0.80)}}
              renderLoading={this.ActivityIndicatorLoadingView}
              startInLoadingState={true}
              ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
            />
            </ScrollView>
            </View>
          </View>:<Activity title='Mock' onPress={()=>{this.onPress(1)}} />}
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
  mock: state.mockReducer,
  mock: state.mockReducer,
  theme: state.themeReducer,
  subject: state.subjectReducer,
  user: state.userReducer
})
export default connect(mapStateToProps, 
  { 
    getMock,
    getMockSelected,
    getMocksDownload,
  
  })(MockScreen);
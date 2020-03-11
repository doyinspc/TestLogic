import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView} from 'react-native';
import { ThemeProvider,ButtonGroup, Icon , Overlay, Button} from 'react-native-elements';
import * as Font from 'expo-font';
import ProgressCircular  from './components/Progress';
import Admob from "./advert/Admob";

import { getTopic, getTopicsDownloadOnly, updateTopic } from './actions/Topic';
import Activity from './components/LoaderTest';
import {ADMOB, ADINTER, ADREWARD, PUBLISHER, EMU } from './actions/Common';
import {
  setTestDeviceIDAsync,
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';
const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class TopicScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      isVisible: false,
      isDownloading: false,
      prog:23
      
    };
  }

  
  //REDIRECT TO TEST SETTINGS
  //ARGURMENTS : TOPICS
 relocate = () =>{
  let values = this.state.values;
    if(values && values.length > 0)
    {
    this.props.navigation.navigate('TestSettingsScreen', { 'topics':this.state.values, testID:null});
    }
 }

 //REDIRECT TO TOPIC SCREEN : RESOURCES
  //ARGUMENTS PASSED THE THEME IDS SELECTED
  relocateOne = (id) =>{
    let values = id;
    if(values)
    {
      this.props.navigation.navigate('ResourcesScreen', {'topicID':id, 'sid':this.state.page})
    }
  }

  changeVisibility = () =>{
    this.setState({isVisible:true})
  }

  changeDownloading = (id) =>{
    this.setState({showAdvertAlert:false, isDownloading:true})
  }

async componentDidMount() {
  
  let arry = this.props.navigation.getParam('topicID');
  this.props.getTopic(arry);
  var page = this.props.navigation.getParam('sid');
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true, page:page });
  this.initAds().catch((error) => console.log(error));
  //AdMobRewarded.setTestDeviceID(EMU);
  // ALWAYS USE TEST ID for Admob ads
  AdMobRewarded.setAdUnitID(ADREWARD);

  AdMobRewarded.addEventListener('rewardedVideoDidRewardUser',
      () =>{this.activateTopic()}
  );
  AdMobRewarded.addEventListener('rewardedVideoDidLoad',
      () =>{}
  );
  AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad',
      () => console.log('interstitialDidLoad1')
  );
  AdMobRewarded.addEventListener('rewardedVideoDidOpen',
      () =>{}
  );
  AdMobRewarded.addEventListener('rewardedVideoDidClose',
      () => console.log('interstitialDidLoad3')
  );
  AdMobRewarded.addEventListener('rewardedVideoWillLeaveApplication',
      () => console.log('interstitialDidLoad4')
  );
}
initAds = async () => {
  await setTestDeviceIDAsync(EMU);
 }


componentWillUnmount() {
  AdMobRewarded.removeAllListeners();
}

bannerError(e) {
  return e;
}

activateLoad = async () =>{
  let d = this.state.watchVideoTopic;
  await this.props.updateTopic({active: 1}, d, async (g)=>{
 })
}



showRewarded = async () =>{
  this.activateTopic()
  this.setState({showAdvertAlert:false});
  AdMobRewarded.setAdUnitID(ADINTER); 
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
}

static getDerivedStateFromProps(nextProps, prevState){
  if(nextProps.topic.topics !== prevState.topics)
  {
    return{selected:true, topics:nextProps.topic.topics}
  }else{
    return{selected:false}
  }
}

  
  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });

    if(selectedIndex == 0 )
    {
      this.relocate()
    }
    else if(selectedIndex == 1 )
    {
        //this.updateTopicx();
    }
    else if(selectedIndex == 2 )
    {
        this.props.getTopicsDownloadOnly(this.props.navigation.getParam('topicID'))
    }
  }
  
  
  comp1 = () => <Icon name='backward' color='white' type='material' />
  comp2 = () => <Icon name='cloud-download' color='white' type='material' />
  comp3 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Update</Text>

render(){

  const {isLoading, isDownloading, topic } = this.props.topic;
  const { themes, ids } = this.props.theme;
  const { name } = this.props.subject.subject;
  const { fontLoaded, selectedIndex, isVisible, prog} = this.state;
  const buttons =  [{element:this.comp1}, {element:isDownloading ? this.comp3a: this.comp2} , {element:this.comp3}] ;
  const list_themes = themes && Array.isArray(themes) && themes.length > 0 && ids  && Array.isArray(ids) ? themes.filter((row)=>ids.includes(row.id)) : null;
  const list_data = list_themes && Array.isArray(list_themes) && list_themes.length > 0 ? list_themes.map((row) =>(<Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:2}} key={row.id}>{row.name}</Text>)) : <Text></Text>;
  
  return (
    <ThemeProvider >
      <View style={styles.topSection}>
          <Text style={styles.h1}>{name}</Text>
          <Text style={styles.h2}>{topic.name}</Text>
      </View>
       <View style={{flex:1}}>
       <Admob type='fullbanner'/>
       
       <Overlay
          isVisible={isVisible}
          windowBackgroundColor="rgba(7, 7, 7, .3)"
          overlayBackgroundColor= {local_color.color1}
          style={{minHeight:200, activeOpacity:0.3}}
          margin={15}
          padding={15}
          width="auto"
        >
          <View style={{flex:1, justifyContent:'space-between', alignContent:'space-between'}}>
          <Text style={styles.h1_overlay}>Info.</Text>
          <ScrollView>
          <View style={{flexDirection:'column', flexWrap:'wrap', margin:0, padding:10, justifyContent:'center', alignContent:'center'}}>
          <View style={{ marginBottom:10}} >
                <Text style={styles.h2_overlay}>Subject</Text>
                <Text style={{color:'white', fontFamily:'PoiretOne', marginTop:2 }}>
                  {name}
                </Text>
             </View>
             <View style={{borderTopColor:local_color.color2, borderTopWidth:1, marginBottom:10}}>
                <Text style={styles.h2_overlay}>Themes</Text>
                <View style={{flexDirection:'column' }}>
                  {list_data}
                </View>
             </View>
             <View style={{borderTopColor:local_color.color2, borderTopWidth:1}}>
                <Text style={styles.h2_overlay}>Instruction</Text>
                <Text style={{color:'white', fontFamily:'PoiretOne', marginTop:2 }}>
                  Select at least one topic and move to the next page.
                </Text>
             </View>

             <View >
                
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='home' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Move to home Page</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='cloud-download' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Download/Update topics</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='book' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Switch to resources</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='spellcheck' type='material' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} > Switch to test</Text>
                </View>
                <View style={{flexDirection:'row', flexWrap:'wrap', }}>
                  <Icon name='ios-stats' type='ionicon' color='white' />
                  <Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:3}} >  View statistics</Text>
                </View>
             </View>
          </View>
          </ScrollView>
          <Button
                title='Close'
                style={styles.but_overlay}
                onPress={()=>this.setState({isVisible:false})}
                buttonStyle={{backgroundColor:local_color.color3}}
            />
          </View>
        </Overlay>

           <View style={{flex:1, alignItems:'center', alignContent:'center'}}>
           <ProgressCircular prog={prog} onDownloaded={() => console.log('onAnimationComplete')}/>
           <Button
               title='Close'
               style={styles.but_overlay}
               onPress={()=>this.setState({isDownloading:false})}
               buttonStyle={{backgroundColor:local_color.color3}}
           />
         </View>
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
  topic: state.topicReducer,
  theme: state.themeReducer,
  subject:state.subjectReducer,
  user: state.userReducer
})
export default connect(mapStateToProps, 
  { 
    getTopic, updateTopic, getTopicsDownloadOnly
   }
   )(TopicScreen);
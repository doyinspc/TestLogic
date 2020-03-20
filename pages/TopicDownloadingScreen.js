import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView} from 'react-native';
import { ThemeProvider,ButtonGroup, Icon , Overlay, Button} from 'react-native-elements';
import * as Font from 'expo-font';
import ProgressCircular  from './components/Progress';
import Admob from "./advert/Admob";

import { getTopic, getTopicsDownloadOnly, updateTopic, getTopicCount } from './actions/Topic';
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
      sid:null,
      fontLoaded: false,
      isVisible: false,
      isDownloading: false,
      selectedIndex: 0,
      prog:0,
      updateState:0,
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
    if(id)
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
  this.props.getTopicCount(arry);
  var page = this.props.navigation.getParam('sid');
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  this.setState({ fontLoaded: true, page:page, sid:arry });
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

activateLoad = async (nu) =>{
  let d = this.state.sid;
  await this.props.updateTopic({active: nu}, d, async (g)=>{
 })
}

showRewarded = async () =>{
  this.activateTopic()
  this.setState({showAdvertAlert:false});
  AdMobRewarded.setAdUnitID(ADINTER); 
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
}

// componentDidUpdate(nextProps, prevState){
//   if(nextProps.topic.tloading[prevState.sid] !== this.props.topic.tloading[prevState.sid])
//   {
//     this.setState({prog:nextProps.topic.tloading[prevState.sid]})
//   }
// }

static getDerivedStateFromProps(nextProps, prevState){
  if(nextProps.topic.tloading[prevState.sid] !== prevState.prog)
  {
    return{prog:nextProps.topic.tloading[prevState.sid]}
  }else{
    return{selected:false}
  }
}

  
  updateIndex = async (selectedIndex) =>{
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
       await this.props.getTopicsDownloadOnly(this.props.navigation.getParam('topicID'))
    }
  }
  
  comp1 = () => <Icon name='arrow-back' color='white' type='material' />
  comp2 = () => <Icon name='cloud-download' color='white' type='material' />
  comp3 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Update</Text>

render(){
  const {isLoading, isDownloading, topic, tloading } = this.props.topic;
  const { themes, ids } = this.props.theme;
  const { name } = this.props.subject.subject;
  const { selectedIndex, isVisible, prog, sid} = this.state;
  const buttons =  [{element:this.comp1}, {element: this.comp2}, {element:this.comp3}] ;
  const list_themes = themes && Array.isArray(themes) && themes.length > 0 && ids  && Array.isArray(ids) ? themes.filter((row)=>ids.includes(row.id)) : null;
  const list_data = list_themes && Array.isArray(list_themes) && list_themes.length > 0 ? list_themes.map((row) =>(<Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:2}} key={row.id}>{row.name}</Text>)) : <Text></Text>;
  if(prog === 100 && topic && topic.active !== 1){
    this.activateLoad(1);
  }else if(prog <  100 && topic && topic.active !== 2)
  {
    this.activateLoad(2);
  }

  return (
    <ThemeProvider >
      <View style={styles.topSection}>
          <Text style={styles.h1}>{name}</Text>
          <Text style={styles.h2}>{topic && topic.name ? topic.name : 'No topics'}</Text>
      </View>
       <View style={{flex:1}}>
       <Admob type='fullbanner'/>
          <View style={{flex:1, alignItems:'center', alignContent:'center'}}>
           <ProgressCircular prog={prog && prog !== undefined ? prog : 5} onDownloaded={() => console.log('onAnimationComplete')}/>
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
    getTopic, updateTopic, getTopicsDownloadOnly, getTopicCount
   }
   )(TopicScreen);
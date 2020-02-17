import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView, ListView } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon , Overlay, Button, SocialIcon} from 'react-native-elements';
import * as Font from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import Admob from "./advert/Admob";

import { getTopics, getTopicSelected, getTopicsDownload, getTopicsDBs, updateTopic } from './actions/Topic';
import Activity from './components/LoaderTest';
import { FlatList } from 'react-native-gesture-handler';
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
      selectedIndex: null,
      checked: {},
      values: [],
      page:1,
      showAdvertAlert: false,
      watchVideoTopic: null,
      isVisible:false,
      selected:false,
      topics:this.props.topic.topics
      
    };
  }

  
  //REDIRECT TO TEST SETTINGS
  //ARGURMENTS : TOPICS
 relocate = () =>{
  let values = this.state.values;
    if(values && values.length > 0)
    {
    this.props.getTopicSelected(values);
    this.props.navigation.navigate('TestSettingsScreen', { 'topics':this.state.values, testID:null});
    }
 }

 //REDIRECT TO TOPIC SCREEN : RESOURCES
  //ARGUMENTS PASSED THE THEME IDS SELECTED
  relocateOne = (id) =>{
    let values = id;
    if(values)
    {
      this.props.navigation.navigate('ResourcesScreen', {'topicID':values, 'sid':this.state.page})
    }
  }

  changeVisibility = () =>{
    this.setState({isVisible:true})
  }

async componentDidMount() {
  let arry = this.props.navigation.getParam('themeID');
  this.props.getTopics(arry);
  this.props.getTopicsDBs(arry);
  //this.props.getTopicsDownload(arry);
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
      () =>{this.activateTopic()}
  );
  AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad',
      () => console.log('interstitialDidLoad1')
  );
  AdMobRewarded.addEventListener('rewardedVideoDidOpen',
  () =>{this.activateTopic()}
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
  console.log(e);
  return;
}

activateTopic = async () =>{
 let d = this.state.watchVideoTopic;
 this.props.updateTopic({'active':1}, d, async ()=>{
  await this.onChange(d, 0, 1);
 })
 
}

showRewarded= async () =>{
  // first - load ads and only then - show
  //AdMobRewarded.requestAd(() => AdMobRewarded.showAd());
  this.setState({showAdvertAlert:false})
  this.props.getTopicsDownload(this.state.watchVideoTopic);
  // Display a rewarded ad
  AdMobRewarded.setAdUnitID(ADINTER); 
  //AdMobRewarded.setTestDeviceID(EMU);
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

//STORE SELECTED TOPICS IN STATE ARRAY : VALUES
onChange = async (topicID, advert, topicActive ) => {
   
    //if the topic active 
    //activate the list
    if(topicActive === 1)
    {
      let news = {...this.state.checked};
      news[topicID] = news[topicID] ? false : true;
    
      const currentIndex = this.state.values.indexOf(topicID);
      const newValues = [...this.state.values];
    
      if (currentIndex === -1) {
        await newValues.push(topicID);
      } else {
        await newValues.splice(currentIndex, 1);
      }
      await this.setState({ checked : news, values:newValues});
    }else if(topicActive === 0)
    {
      this.setState({ showAdvertAlert:true, watchVideoTopic:topicID });
    }
  }

  //DOWNLOAD TOPICS, INSTRUCTIONS, QUESTIONS, ANSWERS, DISTRACTOR
  updateTopicx=()=>{
    let arry = this.props.navigation.getParam('topicID');
    this.props.getTopicsDownload(arry);
  }

  updateIndex = (selectedIndex) =>{
    this.setState({ selectedIndex });

    if(selectedIndex == 0 )
    {
        var p = this.state.page == 1 ? 2 : 1;
        this.setState({page:p});
    }
    else if(selectedIndex == 1 )
    {
        this.updateTopicx();
    }
    else if(selectedIndex == 2 )
    {
        this.relocate()
    }
   
  }
  
  keyExtractors = (item, index) =>index.toString();
  renderItems = ({item, index}) =>
    <ListItem
                key={index}
                titleStyle={item.active == 1 ? styles.listItem : [styles.listItem, {opacity:0.4}] }  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: this.state.checked[item.id] ? 'skyblue' : local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: this.state.checked[item.id] ? 'done' :'school', color:'white', backgroundColor:'red' }} />}
                title={item.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.onChange(item.id, item.advert, item.active)}}   
            />
  

  renderItemsx = ({item, index}) =><Text>{item.id}</Text>
  
  
  comp2 = () => <Icon name={ this.state.page == 1 ? 'book' : 'spellcheck'} color='white' type='material' />
  comp3 = () => <Icon name='cloud-download' color='white' type='material' />
  comp4 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Next</Text>
  comp3a = () => <Icon name='spinner' color='white' type='evilicon' />

render(){

  const {isLoading, isDownloading, topics } = this.props.topic;
  const { themes, ids } = this.props.theme;
  const { name } = this.props.subject.subject;
  const { fontLoaded, selectedIndex, values, page, selected} = this.state;
  const buttons = values && Object.keys(values).length > 0 && page == 1 ? [{element:this.comp2}, {element:isDownloading ? this.comp3a: this.comp3} , {element:this.comp4}] : [{element:this.comp2}, {element:isDownloading ? this.comp3a: this.comp3}];
  const list_themes = themes && Array.isArray(themes) && themes.length > 0 && ids  && Array.isArray(ids) ? themes.filter((row)=>ids.includes(row.id)) : null;
  const list_data = list_themes && Array.isArray(list_themes) && list_themes.length > 0 ? list_themes.map((row) =>(<Text style={{ color:'white', fontFamily:'PoiretOne', marginTop:2}} key={row.id}>{row.name}</Text>)) : <Text></Text>;
  
  return (
    <ThemeProvider >
      <View style={styles.topSection}>
          <Text style={styles.h1}>{name}</Text><View style={{flexDirection:'row', justifyContent:'center'}}>
                  <Icon reverse raised name='home' type='material' color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}} />
                  <Icon reverse raised name='ios-stats' type='ionicon'  color={local_color.color_icon} onPress={()=>{this.props.navigation.navigate('HomeScreen')}}/>
                  <Icon reverse raised name='md-help' type='ionicon' color={local_color.color_icon} onPress={()=>{this.changeVisibility()}}/>
          </View>
      </View>
       <View style={{flex:1}}>
       <Admob type='fullbanner'/>
       <Overlay
          isVisible={this.state.isVisible}
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

        <Overlay
          isVisible={this.state.showAdvertAlert}
          windowBackgroundColor="rgba(7, 7, 7, .3)"
          overlayBackgroundColor= "rgba(7, 7, 7, .3)"
          style={{ opacity:0.3}}
          margin={60}
          padding={15}
          width="auto"
        >
          <View style={{flex:1, width: Math.floor((local_size.WIDTHS / 20) * 15),   justifyContent:'space-between', alignContent:'space-between'}}>
          <Text style={[styles.h1_overlay, { fontFamily:'PoiretOne'}]}>UNLOCK TOPIC</Text>
          <View>
          <View style={{flexDirection:'column'}}>
          <ListItem
                key={1}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7} size='medium' rounded  icon={{ name: 'tv', color:'white', backgroundColor:'red' }} />}
                title='Watch a video'
                bottomDivider
                friction={90}
                tension={100}
                style={{marginVertical:10}}
                activeScale={0.85}
                onPress={()=>{this.showRewarded()}}
                chevron
            />

            <ListItem
                key={2}
                titleStyle={styles.listItem}  
                leftAvatar={<SocialIcon  activeOpacity={0.7} type='facebook'/>}
                title='Share on Facebook'
                bottomDivider
                friction={90}
                tension={100}
                style={{marginVertical:10}}
                activeScale={0.85}
                onPress={()=>{this.relocateOne(1)}}
                chevron
            />

            <ListItem
                key={3}
                titleStyle={styles.listItem}  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'maroon'}} activeOpacity={0.7} size='medium' rounded  icon={{ name: 'party-mode', color:'white', backgroundColor:'red' }} />}
                title='Upgrade to Pro version'
                subtitle='Unlock all topics for this subject, Remove adverts'
                bottomDivider
                friction={90}
                tension={100}
                style={{marginVertical:10}}
                activeScale={0.85}
                onPress={()=>{this.relocateOne(1)}}
                chevron
            />
             
          </View>
          </View>
          <Button
                title='Close'
                style={styles.but_overlay}
                onPress={()=>this.setState({showAdvertAlert:false})}
                buttonStyle={{backgroundColor:local_color.color3}}
            />
          </View>
        </Overlay>
        {fontLoaded  && !isLoading ? 
         <View style={{flex:1}}>
        { page == 1 && topics && Object.keys(topics).length > 0 ? 
           <FlatList
              data={topics}
              keyExtractor={this.keyExtractors}
              initialNumToRender={7}
              renderItem={this.renderItems}
              extraData={this.state}
              style={{flex:1}}
           />
           : page == 2 && topics  ? 
              topics.map((l, i) => (
              <ListItem
                key={i}
                titleStyle={l.active == 1 ? styles.listItem:[styles.listItem, {opacity:0.4}] }  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
                title={l.name}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{this.relocateOne(l.id)}}
                chevron
            />
            ))  
          :
        <View style={{flex:1, minHeight:400, alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>
          <Icon name='cloud-download' type='material' size={70} color={local_color.color1} />
          <Text style={{fontSize: 20, fontFamily:'PoiretOne', alignSelf:'center', justifyContent:'center', margin:0, padding:0, alignContent:'center'}}>Download Topics</Text>
        </View>
        }
        </View>:<Activity title='Topics' onPress={()=>{this.onPress(1)}} />}
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
    getTopics, getTopicSelected, getTopicsDownload, getTopicsDBs, updateTopic,
   }
   )(TopicScreen);
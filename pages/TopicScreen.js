import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ScrollView, ListView, Alert } from 'react-native';
import { ThemeProvider, Avatar,  ListItem, ButtonGroup, Icon , Overlay, Button, SocialIcon} from 'react-native-elements';
import * as Font from 'expo-font';
import ProgressCircular  from './components/Progress';
import Admob from "./advert/Admob";

import { getTopics, getTopicSelected, getTopicsDownloadOnly, getTopicsDBs, updateTopic, getTopicCount } from './actions/Topic';
import Activity from './components/LoaderTest';
import TopicButton from './components/TopicButton';
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
      isDownloading: false,
      selectedIndex: null,
      checked: {},
      values: [],
      page:1,
      showAdvertAlert: false,
      watchVideoTopic: null,
      selected:false,
      topics:this.props.topic.topics,
      downloads:{},
      tupdate:{}
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
  //ARGUMENTS PASSED THE TOPIC ID SELECTED
  relocateOne = (id) =>{
    if(id)
    {
      this.props.navigation.navigate('ResourcesScreen', {'topicID':id, 'sid':this.state.page})
    }
  }
  //REDIRECT TO TOPIC DOWNLOADING SCREEN : DOWN LOAD QUESTION 
  //ARGUMENTS PASSED THE TOPIC ID SELECTED
  relocateDownload = (id) =>{
    if(id)
    {
      this.props.navigation.navigate('TopicDownloadingScreen', {'topicID':id, sel:this.state.checked, val:this.state.values})
    }
  }

  // SHOW ADVERT ALERT
  changeVisibility = () =>{
    this.setState({isVisible:true})
  }

async componentDidMount() {
  //GET THE SELECTED THEMES
  let selected_themes = this.props.navigation.getParam('themezID');
  //GET TOPICS FROM OFFLINE 
  this.props.getTopics(selected_themes)
  //LOAD FONT
  var page = this.props.navigation.getParam('sid');
  await Font.loadAsync({
    'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
    'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
  });
  //SET STATE
  this.setState({ fontLoaded: true, page:page });

  //INITIALIZE VIDEO ADVERT
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

//INITIALIZE ADS
initAds = async () => {
  await setTestDeviceIDAsync(EMU);
 }
componentWillUnmount() {
  AdMobRewarded.removeAllListeners();
}

componentDidUpdate(nextProps, prevState){
  if(nextProps.topic.tupdate[prevState.watchVideoTopic] == 1){
    this.props.updateTopic({active: 2}, prevState.watchVideoTopic, async (g)=>{})
  }

}

bannerError(e) {
  return e;
}

activateLoad = async () =>{
  let d = this.state.watchVideoTopic;
  await this.props.updateTopic({active: 1}, d, async (g)=>{
 })
}

activateTopic = async () =>{
  //IF VIDEO WAS WATCHED THEN ACTIVATE DOWNLOAD
  this.setState({isVisible:false})
  let d = this.state.watchVideoTopic;
  await this.props.updateTopic({active: 2}, d, async (g)=>{
    await this.onChange(d, 0, 2 )
  })
  await this.props.getTopicsDownloadOnly(d, async(c)=>{});
}

showRewarded = async () =>{
  //CLOSE THE ADVERT ALERT
  this.setState({showAdvertAlert:false});
  AdMobRewarded.setAdUnitID(ADINTER); 
  await AdMobRewarded.requestAdAsync();
  await AdMobRewarded.showAdAsync();
}

static getDerivedStateFromProps(nextProps, prevState){
  if(nextProps.topic.tupdate[prevState.watchVideoTopic] !== undefined && nextProps.topic.tupdate[prevState.watchVideoTopic] !== prevState.tupdate[prevState.watchVideoTopic])
  {
    let tload = {...prevState.tupdate};
    tload[prevState.watchVideoTopic] = nextProps.topic.tupdate[prevState.watchVideoTopic];
    return{tupdate: tload};
  }else{ 
    return null;
  }

  if(nextProps.topic.topics !== prevState.topics)
  {
    return{selected:true, topics:nextProps.topic.topics}
  }else{ return null}
}

//STORE SELECTED TOPICS IN STATE ARRAY : VALUES
onChange = (topicID, advert, topicActive, indexes ) => {
    //IF THE TOPIC IS ACTIVE
    //AND THE TOPIC QUESTIONS HAVE ALREADY BEEN DOWNLODED
    //SELECT TOPIC
    if(topicActive === 1)
    {
      this.setState({ watchVideoTopic:topicID });
      this.props.getTopicCount(topicID);
      let news = {...this.state.checked};
      const newValues = [...this.state.values];

      news[topicID] = news[topicID] ? false : true;
      const currentIndex = this.state.values.indexOf(topicID); 
    
      if (currentIndex === -1) {
        newValues.push(topicID);
      } else {
        newValues.splice(currentIndex, 1);
      }
      //UPDATE STATE AND CHECKED VALUES
      this.setState({ checked : news, values:newValues});
    }
    //IF THE TOPIC IS NOT ACTIVE
    //AND TOPIC QUESTIONS NOT DOWNLOADED
    else if(topicActive === 0)
    {
      //SHOW ALERT BOX TO DETERMINE MODE OF PAYMENT
      //ALSO SET THE TOPIC ID AS ACTIVE : WATCHVIDEOTOPIC
      //ALSO SET ADVERT OPTIONS
      this.setState({ showAdvertAlert:true, watchVideoTopic:topicID, advertType:advert });
    }
    //IF THE TOPIC IS NOT ACTIVE
    //AND TOPIC ARE SET TO DOWNLOADING
    else if(topicActive === 2)
    {
      //REDIRECT TO TOPIC DOWNLOADINGPAGE
      this.relocateDownload(topicID);
    }
  }

  //DOWNLOAD TOPICS ONLY
  updateTopicx=()=>{
    let arry = this.props.navigation.getParam('themezID');
    this.props.getTopicsDBs(arry)
    .then((res)=>{
        Alert.alert('Success', 'Downloaded')
    })
    .catch((err)=>{
      Alert.alert('Success', err)
    })
  }

  //BUTTOM BUTTON GROUP
  //0. TOGGLE MODE ACADEMIC AND RESOURCES
  //1. REDOWNLOAD TOPICS
  //2. REDIRECT T0 TEST SETTINGS
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

  rightNote = (nums) =>{
    if(nums === 1)
    {
      return <Icon name='thumb-up' color='green' type='material' /> 
    }
    if(nums === 2)
    {
      return <Icon name='thumb-down' color='red' type='material' /> 
    }
    if(nums === 4)
    {
      return <Icon name='cloud-download' color='green' type='material' /> 
    }
    if(nums === 5)
    {
      return <Icon name='cloud-download' color='yellow' type='material' /> 
    }


  }
  //USE WHEN ACADEMIC
  keyExtractors = (item, index) =>index.toString();
  renderItems = ({item, index}) =>
    <ListItem
                key={index}
                titleStyle={item.active === 1 ? styles.listItem : [styles.listItem, {opacity:0.4}] }  
                leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: item.active == 2 ? 'grey' : this.state.checked[item.id] ? 'skyblue' : local_color.color2}} activeOpacity={0.7}  rounded  icon={{ name: item.active == 2 ? 'cloud-download':this.state.checked[item.id] ? 'done' :'school', color:'white', backgroundColor:'red' }} />}
                title={`${item.name} `}
                rightTitle={this.rightNote(item.questionx)}
                subtitle={ item.active == 2 ? 'Downloading... Click to learn more...' : null}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.85}
                onPress={()=>{item.active == 2  ? this.relocateDownload(item.id) : this.state.downloads[item.id] ? this.onDownloading(item.id) : this.onChange(item.id, item.advert, item.active, index)}}   
            />
  renderItemsx = ({item, index}) =><Text>{item.id}</Text>
  
  //USE WHEN RESOURCES
  keyExtractorss = (item, index) =>index.toString();
  renderItemss = ({item, index}) =>
            <ListItem
              key={index}
              titleStyle={item.active == 1 ? styles.listItem:[styles.listItem, {opacity:0.4}] }  
              leftAvatar={<Avatar overlayContainerStyle={{backgroundColor: 'teal'}} activeOpacity={0.7}  rounded  icon={{ name: 'school', color:'white', backgroundColor:'red' }} />}
              title={item.name}
              bottomDivider
              friction={90}
              tension={100}
              activeScale={0.85}
              onPress={()=>{this.relocateOne(l.id)}}
              chevron
          />
  renderItemsxs = ({item, index}) =><Text>{item.id}</Text>
  
  comp2 = () => <Icon name={ this.state.page == 1 ? 'book' : 'spellcheck'} color='white' type='material' />
  comp3 = () => <Icon name='cloud-download' color='white' type='material' />
  comp4 = () => <Text style={{color:'white', fontFamily:'SulphurPointNormal'}} >Next</Text>
  comp3a = () => <Icon name='spinner' color='white' type='evilicon' />

render(){

  const {isLoading, isDownloading, topics } = this.props.topic;
  const { themes, ids } = this.props.theme;
  const { name } = this.props.subject.subject;
  const { fontLoaded, selectedIndex, values, page, selected, downloads} = this.state;
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
                onPress={()=>{this.activateTopic()}}
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
                onPress={()=>{this.relocatePayment(1)}}
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
           : page == 2 && topics && Object.keys(topics).length > 0  ? 
              <FlatList
                data={topics}
                keyExtractor={this.keyExtractorss}
                initialNumToRender={7}
                renderItem={this.renderItemss}
                extraData={this.state}
                style={{flex:1}}
             /> 
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
    getTopics, getTopicSelected, getTopicsDownloadOnly, getTopicsDBs, updateTopic, getTopicCount
   }
   )(TopicScreen);
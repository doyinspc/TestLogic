import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider, Avatar,  ListItem,  Overlay, Button, SocialIcon} from 'react-native-elements';
const tools = require('./Style');

const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;

// Your App
class TopicScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }


componentDidMount() {
  
  //let arry = this.props.navigation.getParam('themezID');
  
}



  

render(){
  const { show, cat, showRewarded, onShare, onRelocate } = this.props;
  return (
    <ThemeProvider >
        <Overlay
          isVisible={show}
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
                onPress={showRewarded}
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
                onPress={onShare}
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
                onPress={onRelocate}
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
    </ThemeProvider>
  );
};
}
const styles = StyleSheet.create(local_style)
export default TopicScreen;
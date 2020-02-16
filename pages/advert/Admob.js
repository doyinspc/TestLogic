import React from 'react';
import { connect }from 'react-redux';
import { SafeAreaView, View} from 'react-native';
import {ADMOB, ADINTER, ADREWARD, PUBLISHER, EMU } from './../actions/Common'
import {
  setTestDeviceIDAsync,
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';

class AdvertScreen extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null
    };
  }

  bannerError(e) {
    console.log(e);
    return;
  }

  componentDidMount(){
    this.initAds().catch((error) => console.log(error));
  }
  
  initAds = async () => {
   await setTestDeviceIDAsync(EMU);
  }
  
  render() {
    return (
      <View>
        <SafeAreaView>
        { !this.props.user.isPro ?
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={ADMOB}
          servePersonalizedAds
          onDidFailToReceiveAdWithError={this.bannerError} />
            : '' }
        </SafeAreaView>
        </View>
    );
  }
};

const mapStateToProps = state => ({ 
  user: state.userReducer
})
export default connect(mapStateToProps)(AdvertScreen);
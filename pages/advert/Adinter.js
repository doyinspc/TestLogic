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

  componentDidMount() {
    AdMobInterstitial.setTestDeviceID(EMU);
    // ALWAYS USE TEST ID for Admob ads
    AdMobInterstitial.setAdUnitID(ADINTER);

    AdMobInterstitial.addEventListener('interstitialDidLoad',
        () => console.log('interstitialDidLoad')
    );

    AdMobInterstitial.addEventListener('interstitialDidFailToLoad',
        () => console.log('interstitialDidFailToLoad')
    );

    AdMobInterstitial.addEventListener('interstitialDidOpen',
        () => console.log('interstitialDidOpen')
    );
    AdMobInterstitial.addEventListener('interstitialDidClose',
        () => console.log('interstitialDidClose')
    );
    AdMobInterstitial.addEventListener('interstitialWillLeaveApplication',
        () => console.log('interstitialWillLeaveApplication')
    );
}

componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
}

bannerError() {
    console.log('An error');
    return;
}

showInterstitial() {
    console.log('intersial active')
    AdMobInterstitial.requestAd(()=>AdMobInterstitial.showAd());
}
  
  render() {
    !this.props.user.isPro ? this.showInterstitial() : '';
    return (
      <View></View>
    );
  }
};

const mapStateToProps = state => ({ 
  user: state.userReducer
})
export default connect(mapStateToProps)(AdvertScreen);
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
    AdMobRewarded.setTestDeviceID(EMU);
    // ALWAYS USE TEST ID for Admob ads
    AdMobRewarded.setAdUnitID(ADREWARD);
 
    AdMobRewarded.addEventListener('rewardedVideoDidRewardUser',
        () =>{this.activateTopic(this.props.mainID)}
    );
    AdMobRewarded.addEventListener('rewardedVideoDidLoad',
        () => console.log('interstitialDidLoad')
    );
    AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad',
        () => console.log('interstitialDidLoad')
    );
    AdMobRewarded.addEventListener('rewardedVideoDidOpen',
        () => console.log('interstitialDidLoad')
    );
    AdMobRewarded.addEventListener('rewardedVideoDidClose',
        () => console.log('interstitialDidLoad')
    );
    AdMobRewarded.addEventListener('rewardedVideoWillLeaveApplication',
        () => console.log('interstitialDidLoad')
    );
}

componentWillUnmount() {
    AdMobRewarded.removeAllListeners();
}

bannerError() {
    console.log('An error');
    return;
}

showRewarded() {
    // first - load ads and only then - show
    AdMobRewarded.requestAd(() => AdMobRewarded.showAd());
}
  
  render() {
    !this.props.user.isPro ? this.showRewarded() : '';
    return (
      <View></View>
    );
  }
};

const mapStateToProps = state => ({ 
  user: state.userReducer
})
export default connect(mapStateToProps)(AdvertScreen);
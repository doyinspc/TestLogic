import React from 'react';
import { ThemeProvider,  Avatar, Icon, Button } from 'react-native-elements';
import { TextInput, View, Text, StyleSheet,  TouchableHighlight } from 'react-native';
import * as Font from 'expo-font';
const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;
const theme = {
  
};


// Your App
export default class App extends React.Component{
  state = {
    fontLoaded: false,
    opassword:'',
    npassword:'',
    rnpassword:''
  }
  
  async componentDidMount() {
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  onSubmit = () =>{
    const { password, email } = this.state;
    const user = {password, email };
    if(this.state.password ){
      this.props.navigation.navigate('SubjectScreen');
    }else{
      this.setState({ error: 'passwords do not match'});
    }

  }

  render(){
    const { fontLoaded,  opassword, npassword, rnpassword } = this.state;
    return (
      <View style={{flex:1}}>
      {fontLoaded ? <View style={{flex:1}}>
        <View style={styles.topContainer}>
          <Text style={styles.h1}>Change password</Text>
          <Text style={styles.h2}>Complete the form below to login</Text>
        </View>
       <View style={styles.bottomContainer}>
            
              <View style={styles.textwidthx}>
              <Text style={styles.label}>Old Password</Text> 
              </View>
             <TextInput
                style={styles.textplace}
                placeholder='Old Password'
                type='password'
                password={true}
                secureTextEntry={true}
                value={opassword}
                onChangeText={(text) => this.setState({opassword: text})}
            />
            <View style={styles.textwidthx}>
            <Text style={styles.label}>New Password</Text>
            </View> 
            <TextInput
                style={styles.textplace}
                placeholder='Password'
                type='password'
                password={true}
                secureTextEntry={true}
                value={npassword}
                onChangeText={(text) => this.setState({npassword: text})}
            />
            <View style={styles.textwidthx}>
            <Text style={styles.label}>Repeat New Password</Text>
            </View> 
            <TextInput
                style={styles.textplace}
                placeholder='Repeat Password'
                type='password'
                password={true}
                secureTextEntry={true}
                value={rnpassword}
                onChangeText={(text) => this.setState({rnpassword: text})}
            />
 
            <Button
                large
                icon={{name: 'save', type: 'material', color:'#fff' }}
                title='LOGIN' 
                buttonStyle={styles.but}
                onPress={()=>{this.onSubmit()}}
                />
                
       </View>
       </View> : null}
       </View>
   
  );
  }
};

const styles = StyleSheet.create(local_style);
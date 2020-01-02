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
    email: ''
  }
  
  async componentDidMount() {
    await Font.loadAsync({
      'SulphurPoint': require("../assets/fonts/SulphurPoint-Bold.ttf"),
      'SulphurPointNormal': require("../assets/fonts/SulphurPoint-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  onSubmit = () =>{
    const {  email } = this.state;
    const user = {email };
    if(this.state.password ){
      this.props.navigation.navigate('SubjectScreen');
    }else{
      this.setState({ error: 'passwords do not match'});
    }

  }

  render(){
    const { fontLoaded,  email } = this.state;
    return (
      <View style={{flex:1}}>
      {fontLoaded ? <View style={{flex:1}}>
        <View style={styles.topContainer}>
          <Text style={styles.h1}>Forgotten password</Text>
          <Text style={styles.h2}>Complete the form below to login</Text>
        </View>
       <View style={styles.bottomContainer}>
            
       <View style={styles.textwidthx}>
              <Text style={styles.label}>Email</Text> 
              </View>
                <TextInput
                    style={styles.textplace}
                    placeholder='Email'
                    type='email'
                    value={email}
                    onChangeText={(text) => this.setState({email: text})}
                />
            <Button
                large
                icon={{name: 'save', type: 'material', color:'#fff' }}
                title='LOGIN' 
                buttonStyle={styles.but}
                onPress={()=>{this.onSubmit()}}
                />
                <Button
                color='#fff'
                icon={{name: 'arrow-left', type: 'octicon', color:local_color.MAIN }}
                title='Login' 
                textStyle={{color:local_color.MAIN}}
                buttonStyle={styles.butlink}
                onPress={()=>{this.props.navigation.navigate('LoginScreen')}}
                />
       </View>
       </View> : null}
       </View>
   
  );
  }
};

const styles = StyleSheet.create(local_style);
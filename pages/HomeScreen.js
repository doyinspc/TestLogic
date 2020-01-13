import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View, ImageBackground , ScrollView, TouchableHighlight} from 'react-native';
import {Icon } from 'react-native-elements';
import { ThemeProvider, Button } from 'react-native-elements';
import { getSubjectsClear, getTableClear } from './actions/Subject';


// Your App

const tools = require('./components/Style');
const local_style = tools.Style;
const local_color = tools.Colors;
const local_size = tools.Sizes;


class HomeScreen extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      selectedIndex: null
    };
  }
   dropSubjects =()=>{
    this.props.getSubjectsClear();
   }
   dropTable = table => {
    this.props.getTableClear(table);
   }
  
  render() {
    return (
      <ThemeProvider >
        <ImageBackground
            source={require('./../assets/images/main.jpg')}
            style={{
              flex:.4,
              position: 'relative', 
              top: 0,
              left: 0,
              marginBottom:10,
            }}
          >
          <Text style={{ 
             fontFamily:'PoiretOne',
             fontSize: 50,
             color:'white',
             alignContent:'space-around',
             justifyContent:'flex-end',
             alignSelf:'flex-end',
             padding:40,
          }}> Q&A</Text>
          <View
              style={{
                color:'white',
                position: 'absolute',
                bottom: 0,
                margin: 0,
                padding: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                
                width: '100%'
              }}
          >
              <Text style={{alignSelf:'center', color:'white', fontFamily:'SulphurPointNormal'}}>Mobile Learning Center</Text>
          </View>
        </ImageBackground>
        
        <View style={{backgroundColor:local_color.color4,  flex:1, justifyContent:'space-between'}}>
        <ScrollView>
        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('LoginScreen')}} underlayColor="grey">
        <View style={styles.home_list_container}>
        <Icon name='lock' padding={10}  paddingLeft={30} color='teal' size={80} type="material"/>
        <View style={{padding:10}}>
          <Text style={{fontFamily:'SulphurPoint', fontSize:20, marginBottom: 5}}>Login</Text>
          <Text style={{fontFamily:'SulphurPointNormal', fontSize:12, color:'grey', flexWrap:'wrap', position:'relative' }}>Reset password.</Text>
          <Text style={{fontFamily:'SulphurPointNormal', fontSize:12 , color:'grey'}}>Online or offline</Text>
        </View>
        </View>
        </TouchableHighlight>
         
        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('SubjectScreen')}} underlayColor="grey">
        <View style={styles.home_list_container}>
        <Icon name='spellcheck' padding={10}  paddingLeft={30} color= 'red' size={80} type="material"/>
        <View style={{padding:10}}>
          <Text style={{fontFamily:'SulphurPoint', fontSize:20, marginBottom: 5}}>Subjects Pool</Text>
          <Text style={{fontFamily:'SulphurPointNormal', fontSize:12, color:'grey', flexWrap:'wrap', position:'relative' }}>Learn with a focus</Text>
          <Text style={{fontFamily:'SulphurPointNormal', fontSize:12 , color:'grey'}}>Online or offline</Text>
        </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('SubjectScreen')}} underlayColor="grey">
        <View style={styles.home_list_container}>
        <Icon name='redeem' padding={10}  paddingLeft={30} color= 'skyblue' size={80} type="material"/>
        <View style={{padding:10}}>
          <Text style={{fontFamily:'SulphurPoint', fontSize:20, marginBottom: 5}}>Mock Test</Text>
          <Text style={{fontFamily:'SulphurPointNormal', fontSize:12, color:'grey', flexWrap:'wrap', position:'relative' }}>Simulate test</Text>
          <Text style={{fontFamily:'SulphurPointNormal', fontSize:12 , color:'grey'}}>Win prizes</Text>
        </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=>{this.props.navigation.navigate('MockScreen')}} underlayColor="grey">
        <View style={styles.home_list_container}>
        <Icon name='payment' padding={10}  paddingLeft={30} color= {local_color.color2} size={80} type="fontawesome"/>
        <View style={{padding:10}}>
          <Text style={{fontFamily:'SulphurPoint', fontSize:20, marginBottom: 5}}>Online Payment</Text>
          <Text style={{fontFamily:'SulphurPointNormal', fontSize:12, color:'grey', flexWrap:'wrap', position:'relative' }}>Easy simple</Text>
          <Text style={{fontFamily:'SulphurPointNormal', fontSize:12 , color:'grey'}}>Get to prepare your test.</Text>
        </View>
        </View>
        </TouchableHighlight>
        <Button 
          title="Subjects" 
          onPress={()=>{this.props.navigation.navigate('SubjectScreen')}}
          />

          <View>
            <Button 
              title="Register" 
              onPress={()=>{this.props.navigation.navigate('RegisterScreen')}}
              />
          </View>
          <View>
            <Button 
              title="Login" 
              onPress={()=>{this.props.navigation.navigate('LoginScreen')}}
              />
          </View>
          <View>
          <Button 
              title='DROP ALL'
              
              />
          </View>
          <View>
          <Button 
              title='DROP Subject Table'
              onPress={()=>{this.dropTable('subject')}}
              />
          </View>
          <View>
          <Button 
              title='DROP Test Table'
              onPress={()=>{this.dropTable('test')}}
              />
          </View>
          <View>
          <Button 
              title='DROP Scores Table'
              onPress={()=>{this.dropTable('score')}}
              />
          </View>
          <View>
          <Button 
              title='Show Test Settings'
              onPress={()=>{this.props.navigation.navigate('TestSettingsScreen', {'topics':'1,2,3,4,5'})}}
              />
          </View>
          <View>
          <Button 
              title='Show All Test'
              onPress={()=>{this.props.navigation.navigate('TestScreen', {'subjectID':1})}}
              />
          </View>
          <View>
          <Button 
              title='Question'
              onPress={()=>{this.props.navigation.navigate('QuestionScreen', {'testID':1})}}
              />
          </View>
          </ScrollView>
          </View>
      </ThemeProvider>
    );
  }
};

const styles = StyleSheet.create(local_style);
const mapStateToProps = state => ({ 
  subject: state.subjectReducer
})
export default connect(mapStateToProps, { getSubjectsClear, getTableClear})(HomeScreen);
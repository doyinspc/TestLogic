import React from 'react';
import { connect }from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeProvider, Button } from 'react-native-elements';
import { getSubjectsClear, getTableClear } from './actions/Subject';
import Headers from './components/Header'

// Your App
class HomeScreen extends React.Component {

   dropSubjects =()=>{
    this.props.getSubjectsClear();
   }
   dropTable = table => {
    this.props.getTableClear(table);
   }
  
  render() {
    return (
      <ThemeProvider >
          <View style={{flex:1, justifyContent:'space-between'}}>
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
              onPress={()=>{this.dropSubjects()}}
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
              onPress={()=>{this.props.navigation.navigate('QuestionScreen', {'testID':3})}}
              />
          </View>
          </View>
      </ThemeProvider>
    );
  }
};
const mapStateToProps = state => ({ 
  subject: state.subjectReducer
})
export default connect(mapStateToProps, { getSubjectsClear, getTableClear})(HomeScreen);
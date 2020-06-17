import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const MyComponent = (props) => (
  <FAB
    style={{
      position: 'absolute',
      margin: 30,
      right: 10,
      top: props.location,
      backgroundColor: props.color
    }}
    medium
    icon={props.icon}
    onPress={props.onPress()}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 20,
    right: 0,
  },
})

export default MyComponent;
import React from 'react';
import { ThemeProvider, Header } from 'react-native-elements';

// Your App
export default function Headers() {
  return (
    <ThemeProvider >
        <Header
        height={60}
        backgroundColor= 'teal'
        shadowColor= 'black'
        shadowRadius= {5}
        shadowOpacity= {0.1}
        
            statusBarProps={{ barStyle: 'light-content' }}
            barStyle="light-content" // or directly
            placement="center"
            leftComponent={{ icon: 'menu', color: '#fff', style: { color: '#fff' } }}
            centerComponent={{ text: 'Subjects', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff', style: { color: '#fff' } }}
            />
    </ThemeProvider>
  );
};
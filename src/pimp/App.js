import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar
} from 'react-native';

import {RootNavigator} from './Navigator';


export default class App extends React.Component {
  render() {
    return (
      <RootNavigator/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

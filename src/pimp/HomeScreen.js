import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    StatusBar
} from 'react-native';


export default class HomeScreen extends React.Component {
    static navigationOptions = {
       title: 'Welcome'
     };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar></StatusBar>
      </View>
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

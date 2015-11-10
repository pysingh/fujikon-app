/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 'use strict';

 var React = require('react-native');
 var DrawGraphs = require('./js/DrawGraph');
 var Geolocation = require('./js/Geolocation');
 var MapView = require('./js/Mapview');
 var UserStats = require('./js/UserStats');
 var Login = require('./js/LoginView');
 var list = require('./js/ListView');
//var Navigat = require('./js/navigator');

var {  
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
} = React;


var Healthmonitor = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
      style={styles.navigationContainer}
      initialRoute={{
        title: "Your Profile",
        component: UserStats,
      }} />
      );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  navigationContainer: {
    flex: 1
  }
});

AppRegistry.registerComponent('Healthmonitor', () => Healthmonitor);

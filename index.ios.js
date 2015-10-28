/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var DrawGraphs = require('./js/DrawGraph');
var Geolocation1 = require('./js/Geolocation');
var MapView = require('./js/Mapview');
var UserStats = require('./js/UserStats');

var {  
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

//var BarChart = ReactD3.BarChart;

var data = [{
  label: 'somethingA',
    values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
}];
var xData = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];
var yData = ['30', '1', '1', '2', '3', '5', '21', '13', '21', '34', '55', '30', '23', '54', '76', '21', '32'];
var Healthmonitor = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        
        <Geolocation1/>
      </View>
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
});

AppRegistry.registerComponent('Healthmonitor', () => Healthmonitor);

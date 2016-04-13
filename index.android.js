/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  TouchableOpacity,
  View,
} = React;
var PreWorkout = require('./js/PreWorkout');
var WorkoutPage = require('./js/Workout');
var WorkoutOptionsListView = require('./js/WorkoutOptionsListView');
var ActivityOptionListView = require('./js/ActivityOptionListView');
var TargetOptions = require('./js/TargetOptions');
var Summary = require('./js/Summary');
var TargetOptionsAndroid = require('./js/TargetOptionsAndroid');
var UserStats = require('./js/UserStats');



var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (route.index == 1 || route.index == 3) {      
    } 
    else {
      var backButtonText = '< Back';
      if (route.index == 1) {
        backButtonText = "< Login";
      }
      return ( 
        <View style={styles.BackButtonBGStyle}>
        <TouchableOpacity 
            style = {{marginTop: 0}} 
            onPress = {() => {
              if (index == 1 || index == 3) {
                
              } else {
                navigator.pop();
              }
            }}> 
        </TouchableOpacity> 
        </View>
      );
    }
  },

  RightButton: function(route, navigator, index, navState) {
    return null;
  },

  Title: function(route, navigator, index, navState) {
    return ( 
      <Text style={{
    backgroundColor: '#F5FCFF'}}> {route.name} </Text>
    );
  },
}


var Healthmonitor = React.createClass({
  render: function() {
    return (
      /*<View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Shake or press menu button for dev menu
        </Text>
      </View>*/
        <Navigator
          initialRoute={{id: 'UserStats', name: 'UserStats'}}
          renderScene={this.renderScene.bind(this)}
          configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }}
          navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            navIcon={require('image!ic_launcher')}
            style={styles.navBar}/>
           }  
           />
      );
    },
    renderScene(route, navigator) {
        var routeId = route.id;
        if (routeId === 'PreWorkout') {
          return (
            <PreWorkout 
              navigator={navigator} />
          );
        }
        if (routeId === 'WorkoutPage') {
          return (
            <WorkoutPage
              navigator={navigator}
              BLEConnectionModule = {route.BLEConnectionModule} />
          );
        }
        if (routeId === 'WorkoutOptionsListView') {
          return (
            <WorkoutOptionsListView
              navigator={navigator}
              obj = {route.passProps.obj} />
          );
        }
        if (routeId === 'ActivityOptionListView') {
          return (
            <ActivityOptionListView
              navigator={navigator}
              obj = {route.passProps.obj} />
          );
        }
        if (routeId === 'TargetOptions') {
          return (
            <TargetOptions
              navigator={navigator} />
          );
        }
        if (routeId === 'Summary') {
          return (
            <Summary
              navigator={navigator}
              obj = {route.passProps} />
          );
        }
        if (routeId === 'TargetOptionsAndroid') {
          return (
            <TargetOptionsAndroid
              navigator={navigator}
              obj = {route.passProps.obj} />
          );
        }
        if (routeId === 'UserStats') {
          return (
            <UserStats
              navigator={navigator} />
          );
        }
        return this.noRoute(navigator);
    },
    noRoute(navigator) {

      return (
        <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
          <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
              onPress={() => navigator.pop()}>
            <Text style={{color: 'red', fontWeight: 'bold'}}>Route not found</Text>
          </TouchableOpacity>
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
  navBar:{
    width:500,
    height:76
  },
});

AppRegistry.registerComponent('Healthmonitor', () => Healthmonitor);

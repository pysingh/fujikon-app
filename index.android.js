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
  BackAndroid,
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
var globalNavigator ;
var globalNavigatorId;


BackAndroid.addEventListener('hardwareBackPress', function() {
    //console.log(this.props.test);
  // console.log(this);
  //console.log(this.props.route);
  if(globalNavigatorId == 'UserStats'){

  }else{
    globalNavigator.pop()
    return true;
  }
  return false;
});
var Healthmonitor = React.createClass({
  render: function() {
    return (
        <Navigator
          initialRoute={{id: 'UserStats', name: 'UserStats'}}
          renderScene={this.renderScene.bind(this)}
          configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromRight;
          }} />
      );
    },
    renderScene(route, navigator) {
       globalNavigator = navigator;
        var routeId = route.id;
        globalNavigatorId = routeId;
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
              navigator={navigator}
              test = 'lastpoint' />
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

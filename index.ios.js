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
 var PreWorkout = require('./js/PreWorkout');
 var Try = require('./js/trying');
//var Navigat = require('./js/navigator');

var {  
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS,
  Navigator,
} = React;


var Healthmonitor = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
      style={styles.navigationContainer}
      initialRoute={{
        title: "Fujikon",
        component: List,
      }} />
      );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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

var TabBarExample = React.createClass({

  statics: {
    title: '<Navigator>',
    description: 'JS-implemented navigation',
  },

  renderScene: function(route, nav) {
    switch (route.id) {
      case 'userStats':
        return <UserStats navigator={nav} />;
      case 'PreWorkout':
        return <PreWorkout navigator={nav} />;
      case 'geolocation':
        return <Geolocation navigator={nav} />;
      default:
        return (
          <NavMenu
            message={route.message}
            navigator={nav}
            onExampleExit={this.props.onExampleExit}
          />
        );
    }
  },

  render: function() {
    return (
      <Navigator
        ref={this._setNavigatorRef}
        style={styles.container}
        initialRoute={{ message: 'First Scene', }}
        renderScene={this.renderScene}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromBottom;
        }}
      />
    );
  },


  componentWillUnmount: function() {
    this._listeners && this._listeners.forEach(listener => listener.remove());
  },

  _setNavigatorRef: function(navigator) {
    if (navigator !== this._navigator) {
      this._navigator = navigator;

      if (navigator) {
        var callback = (event) => {
          console.log(
            `TabBarExample: event ${event.type}`,
            {
              route: JSON.stringify(event.data.route),
              target: event.target,
              type: event.type,
            }
          );
        };
        // Observe focus change events from the owner.
        this._listeners = [
          navigator.navigationContext.addListener('willfocus', callback),
          navigator.navigationContext.addListener('didfocus', callback),
        ];
      }
    }
  },
});

AppRegistry.registerComponent('Healthmonitor', () => Healthmonitor);

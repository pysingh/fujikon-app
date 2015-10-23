'use strict';


var React = require('react-native');
var {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
} = React;

var STORAGE_KEY = '@AsyncStorageExample:key';

exports.framework = 'React';
exports.title = 'Geolocation';
exports.description = 'Examples of using the Geolocation API.';

exports.examples = [
  {
    title: 'navigator.geolocation',
    render: function(): ReactElement {
      return <GeolocationExample />;
    },
  }
];

var GeolocationExample = React.createClass({
  watchID: (null: ?number),


  getInitialState: function() {
    return {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      initialSpeed : 'unknown',
    };
  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({initialPosition}),
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({lastPosition});
    });
    //AsyncStorage.setItem('coordinates', JSON.stringify(this.state.lastPosition,['latitude']));
    
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },
  
  replacer: function(coordinates) {

        var coords_latitude = JSON.stringify(coordinates,['latitude']);
        coords_latitude = String(coords_latitude);
        AsyncStorage.removeItem('coordinates');
        //localStorage.removeItem("coordinates");
        coords_latitude = JSON.parse(coords_latitude);
        return coords_latitude;

        
        var obj = AsyncStorage.getItem('coordinates');
        return coordinates.latitude;
        //return obj;
        //return latitude;
        //coordinates.setItem(latitude);
        //return latitude.getItem('latitude');
        //latitude = eval( '  +latitude +'}');
        //var t = JSON.parse(JSON.stringigy(coordinates);
        var l = JSON.parse('{"latitude" : 123.3211}');
        return t;//=>this._latitude;
        //Object.keys(latitude);

        //return latitude;
    
    //return undefined;
  },

  replace: function(){
    return this.state.lastPosition.coords;
  },
  //var item = this.state.lastPosition.coords;
  render: function() {
    return (
      <View>
        <Text>
          <Text style={styles.title}>Initial position: </Text>
          {JSON.stringify(this.state.initialPosition.coords)}
        </Text>
        <Text>
          <Text style={styles.title}>Current position: </Text>
          {this.replacer(this.state.lastPosition.coords)}
          
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});

module.exports = GeolocationExample;
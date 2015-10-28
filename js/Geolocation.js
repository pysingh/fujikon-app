'use strict';

var DrawGraphs = require('./DrawGraph');
var React = require('react-native');

var {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
} = React;

var speedData = [];
var timeData = [];
var count = 0;
var STORAGE_KEY = '@AsyncStorageExample:key';
var xData = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];
var yData = ['30', '1', '1', '2', '3', '5', '21', '13', '21', '34', '55', '30', '23', '54', '76', '21', '32'];

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
    AsyncStorage.getItem("coords").then((value) => {
            this.setState({"coords": value});
        }).done();

  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
    this.saveData("coords",(this.state.lastPosition.timestamp));
  },
  

  replacer: function(coordinates) {
        //coordinates = (coordinates + " ");
        //return coordinates;
        //if(count===10)
        //  return;
        var latitude = JSON.stringify(coordinates,['latitude']);
        var timeValue = count * 10;
        count = count +1;
        timeData.push(timeValue);

        latitude = (latitude +'');
        latitude = latitude.split(":"); 
        if(latitude)
        {
          var latitudeInFloat = parseFloat(latitude[1]).toFixed(2);
          speedData.push(if(isNan(latitudeInFloat.toString()) ? 0 : latitudeInFloat.toString());
          return latitudeInFloat  ;
        }
        else
          return 0.000;
        //var answer =   eval('(' + latitude + ')');
        //answer = (answer+" answer");
        
        //return answer[2];
        //var answer = JSON.parse(latitude);
        //return latitude;
        //return latitude;//=>latitude[latitude];
        //console.log("///////////////////////");
        //var name = JSON.parse('{"nam" : 123.216}');
        // var l = JSON.parse('{"latitude" : 123.3211}');
        // return l[latitude];
        // console.log(latitude);
        // return latitude;
        // var location =  AsyncStorage.getItem("coords");
        // return location;
        // var coords_latitude = JSON.stringify(coordinates,['latitude']);
        // coords_latitude = String(coords_latitude);
        // AsyncStorage.removeItem('coordinates');
        // //localStorage.removeItem("coordinates");
        // coords_latitude = JSON.parse(coords_latitude);
        // return coords_latitude;

        
        // var obj = AsyncStorage.getItem('coordinates');
        // return coordinates.latitude;
        // //return obj;
        // //return latitude;
        // //coordinates.setItem(latitude);
        // //return latitude.getItem('latitude');
        // //latitude = eval( '  +latitude +'}');
        // //var t = JSON.parse(JSON.stringigy(coordinates);
        // var l = JSON.parse('{"latitude" : 123.3211}');
        // return t;//=>this._latitude;
        //Object.keys(latitude);

        //return latitude;
    
    //return undefined;
  },

  // replace: function(){
  //   return this.state.lastPosition.coords;
  // },

  //  saveData: function(key,value) {
  //       AsyncStorage.setItem(key, value);
  //       this.setState({key : value});
  //   },

  //var item = this.state.lastPosition.coords;
  render: function() {
    //setInterval(this.replacer(this.state.lastPosition), 1000);
    console.log("=>=>=>=>=>=>");
    console.log("SpeedData->"+speedData+" TimeData"+timeData+" Count"+count);
        return (
      <View>
      <DrawGraphs {...this.props} xAxisName="distance" yAxisName="time" xData={xData} yData={yData}/>
        
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
'use strict';

var DrawGraphs = require('./DrawGraph');
var React = require('react-native');

var {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var speedData = [];
var timeData = [];
var elevationData = [];
var count = 0;
var STORAGE_KEY = '@AsyncStorageExample:key';
var flagValue = 0;
//var xData = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];
//var yData = ['30', '1', '1', '2', '3', '5', '21', '13', '21', '34', '55', '30', '23', '54', '76', '21', '32'];

exports.framework = 'React';
exports.title = 'Geolocation';
exports.description = 'Using the Geolocation API.';

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
    //this.saveData("coords",(this.state.lastPosition.timestamp));
  },
  

  getLocationData: function(coordinates) {
    var speed = JSON.stringify(coordinates,['altitude']);
    var timeValue ;
    count = count +1;
    speed = (speed +'');
    speed = speed.split(":"); 
    if(speed)
    {
      var speedInFloat = parseFloat(speed[1]).toFixed(2);
      if(speedInFloat.toString() != 'NaN')
      {
        timeValue = count;
            speedInFloat = parseFloat(speedInFloat*3.28).toFixed(2); //Converting meters to feet.
            speedData.push(speedInFloat.toString());
            timeData.push(timeValue.toString());
          }
          return speedInFloat; 
        }
        else
          return 0.000;
      },

      toggleView: function(){
        if(flagValue==0)
          flagValue = 1;
        else
        {  
          speedData = [];
          timeData = [];
          count = 0;
          flagValue = 0;
        }
        this.setState({'flagValue':1})
      },


  //  saveData: function(key,value) {
  //       AsyncStorage.setItem(key, value);
  //       this.setState({key : value});
  //   },


  render: function() {
    console.log("SpeedData->"+speedData+" TimeData"+timeData+" Count"+count);
    if(flagValue == 0)
      return (
        <View style={styles.container}>
        <Text>Taking location information....</Text>
        <View >
        <Text style={styles.title}>Current position: </Text>
        {JSON.stringify(this.state.lastPostion)}
        <Text>{this.getLocationData(this.state.lastPosition.coords)}</Text>
        
        
        <TouchableHighlight onPress={(this.toggleView)} style={styles.button}>
        <Text style={styles.buttonText}>Plot the graph</Text>
        </TouchableHighlight>

        </View>
        </View>
        );
    else
      return(
        <View style={styles.container}>
        <View>
        <DrawGraphs {...this.props} xAxisName="time" yAxisName="elevation" xData={timeData} yData={speedData}/>
        <TouchableHighlight onPress={(this.toggleView)} style={styles.button}>
        <Text style={styles.buttonText}>Restart</Text>
        </TouchableHighlight>
        </View>
        </View>
        );
  }
});

var styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  changeButton: {
    alignSelf: 'center',
    marginTop: 5,
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
  },
  button: {
    height: 36,
    flex: 1,
    backgroundColor: "#555555",
    borderColor: "#555555",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center"
  },
});

module.exports = GeolocationExample;
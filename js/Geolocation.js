'use strict';

var DrawGraphs = require('./DrawGraph');
//var UserStats = require('./UserStats');
var React = require('react-native');
//var PreWorkout = require('./PreWorkout');
//var alert = require('react-native-alert');


var {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  ScrollView,
  NativeAppEventEmitter
} = React;

var speedData = [];
var timeData = [];
var elevationData = [];
var count = 0;
var STORAGE_KEY = '@AsyncStorageExample:key';
var flagValue = 0;
var target = "Time";
var activity,workout;
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
      BLEData : 0,
    };
  },

  componentDidMount: function() {
    NativeAppEventEmitter.addListener("receivedBLEData", (data) => { 
        
        console.log("app event emitter: receivedBLEData:", data.value)
        this.setState({BLEData : data.value});
        });

    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({initialPosition}),
      (error) => { 
        alert(error.message)},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({lastPosition});
    });
    AsyncStorage.getItem("targetWorkoutOption").then((value) => {
        console.log("Target value.."+value);
        target = value;
        this.setState({"targetWorkoutOption": value});
      }).done();

    AsyncStorage.getItem("selectedActivity").then((value) => {
      console.log("Async value "+value);
      activity=value;
      this.setState({"selectedActivity": value});
    }).done();

    AsyncStorage.getItem("selectedWorkout").then((value) => {
      console.log("Async value "+value);
      workout=value;
      this.setState({"selectedWorkout": value});
    }).done();



  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
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
          //this.props.navigator.replace({
          //  component : UserStats,
          //});
        }
        //this.setState({'flagValue':1})
      },


  render: function() {
    console.log("SpeedData->"+speedData+" TimeData"+timeData+" Count"+count);
    if(flagValue == 0)
      return (
        <View style={styles.wholeScreen}>
          <View style={styles.container}>
          <Text style={styles.title}>Time: </Text>
          <Text>------------------------------</Text>
          <Text style={styles.title}>Target : {target}</Text>
          <Text>------------------------------</Text>
          <Text style={styles.title}>HeartBeat : {this.state.BLEData}</Text>

          
          </View>
          <TouchableHighlight onPress={(this.toggleView)} underlayColor="#EEEEEE" style={styles.button}>
          <Text style={styles.buttonText}>Plot the graph</Text>
          </TouchableHighlight>
          <Text style={styles.instructionFont}>The location data is being taken. {'\n'}Altitude Value :{this.getLocationData(this.state.lastPosition.coords)}</Text>
        </View>
        
        );
    else
      return(
        <View>
          <View style={styles.graphContainer}>
          <Text style={styles.bigTitle}>Summary</Text>
          <Text style={styles.title}>Activity : {activity}</Text>
          <Text style={styles.title}>Workout : {workout}</Text>
          <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={(this.toggleView)} style={styles.button}>
          <Text style={styles.buttonText}>Workout Again</Text>
          </TouchableHighlight>
          </View>
          <DrawGraphs {...this.props} xAxisName="time(in secs)" yAxisName="elevation(in feet)" xData={timeData} yData={speedData}/>
          </View>
        </View>
        );
  }
});

var styles = StyleSheet.create({
  bigTitle:{
    fontWeight: '500',
    fontSize: 30,
  },
  title: {
    fontWeight: '500',
    fontSize : 18,
  },
  wholeScreen:{
    //backgroundColor: '#F5FCFF',
    flex :1,
    alignItems:'stretch',
    justifyContent:'center',
    marginTop: 70,
    marginBottom:20,
    //flexDirection: 'row',
  },
  scrollView: {
    //backgroundColor: '#6A85B1',
    //height: 300,
    //alignItems:'center'

  },
  buttonContainer:{
    alignItems:'stretch',
    flex:1,
    //justifyContent:'center',
    marginTop:10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    //backgroundColor: '#F5FCFF',
    
    //height : 300,
    //marginTop:10,
    //marginBottom:10,
  },
  graphContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#F5FCFF',
    marginTop:70,
  },
  changeButton: {
    alignSelf: 'center',
    marginTop: 5,
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
  },
  button: {
    height: 40,
    //flex: 1,
    backgroundColor: "#FCB130",
    borderColor: "#555555",
    //borderWidth: 1,
    borderRadius: 8,
    //marginTop: 10,
    marginRight: 15,
    marginLeft: 15,
    justifyContent: "center",
  },
   buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center",

   },
   instructionFont:{
    color: "#7C7C7C",
    fontSize:18,
    alignSelf:"center",
  },
});

module.exports = GeolocationExample;
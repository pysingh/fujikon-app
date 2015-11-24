'use strict';

var React = require('react-native');
//var TimerMixin = require('react-timer-mixin');
var Summary = require('./Summary');

var {  
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableHighlight,
  PickerIOS,
  AsyncStorage,
  AlertIOS,
} = React;

var target = "Running";
var speedData = [];
var timeData = [];
var elevationData = [];
var pointCounts = 0;

var Workout = React.createClass({

	//mixins: [TimerMixin],
	watchID: (null: ?number),

	getInitialState: function() {
    return {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      initialSpeed : 'unknown',
    };
  	},

	componentDidMount: function() {
		AsyncStorage.getItem("targetWorkoutOption").then((value) => {
      	console.log("Target value.."+value);
      	target = value;
      	this.setState({"targetWorkoutOption": value});
    	}).done();

    	AsyncStorage.getItem("speedData").then((value) => {
      	console.log("Speed value.."+value);
      	target = value;
      	this.setState({"speeData": value});
    	}).done();

    	AsyncStorage.getItem("timeData").then((value) => {
      	console.log("Time value.."+value);
      	target = value;
      	this.setState({"TimeData": value});
    	}).done();

    	AsyncStorage.getItem("pointCounts").then((value) => {
      	console.log("Count value.."+value);
      	target = value;
      	this.setState({"pointCounts": value});
    	}).done();

    	navigator.geolocation.getCurrentPosition(
      	(initialPosition) => this.setState({initialPosition}),
      	(error) => { 
        alert(error.message)},
      	{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      	);
    	this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      	this.setState({lastPosition});
    });	
 	},

 	componentWillMount: function() {
    	navigator.geolocation.clearWatch(this.watchID);
 	},

 	getLocationData: function(coordinates) {
    var speed = JSON.stringify(coordinates,['latitude']);
    var timeValue ;
    pointCounts = pointCounts +1;
    speed = (speed +'');
    speed = speed.split(":"); 
    if(speed)
    {
      var speedInFloat = parseFloat(speed[1]).toFixed(2);
      if(speedInFloat.toString() != 'NaN')
      {
        timeValue = pointCounts;
        speedInFloat = parseFloat(speedInFloat*3.28).toFixed(2); //Converting meters to feet.
        speedData.push(speedInFloat.toString());
        timeData.push(timeValue.toString());
      }
      return speedInFloat; 
    }
    else
      return 0.000;
    },

 	_displayTime: function(val){
 		console.log(val);
 		return val;

 	},

 	saveData: function(key,value) {
    console.log(key+" :storing :"+value);
    AsyncStorage.setItem(key, value);
    this.setState({key : value});
  },

 	onStopPressed: function(){
 		this.saveData("speedData",speedData);
 		this.saveData("timeData",timeData);
 		this.saveData("pointCounts",pointCounts);
 		this.props.navigator.replace({
            component: Summary,marginRight: 5,
    marginBottom: 5,
    marginTop: 5,
            componentConfig : {
              title : "My New Title"
            },
          }
 			);
 	},
	
	render: function(){
		//console.log("Reaching...");
		console.log("SpeedData->"+speedData+" TimeData"+timeData+" pointCounts"+pointCounts);
		return(
			<View>

				<View style={styles.container}>
				<Text>Time:</Text>
				<Text>------------------------------</Text>
				<Text>Target : {target}</Text>
   				</View>
   				<TouchableHighlight onPress={(this.onStopPressed)} style={styles.button}>
      				<Text style={styles.buttonText}>Stop</Text>
      			</TouchableHighlight>
      			<Text style={styles.buttonText}>The location data is being taken. {'\n'}Altitude Value :{this.getLocationData(this.state.lastPosition.coords)}</Text>
 
			</View>
		);

	}


});

var styles = StyleSheet.create({
   wholeScreen:{
   		alignItems:'center',
   		

   },
     container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 70,
    height : 250,
  },
  rowStyle:{
  	alignItems: 'stretch',
  	flexDirection :'row',
  	flex: 2,
  },
   button: {
        height: 40,
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
   separator: {
    height: 5,
    backgroundColor: '#dddddd',
    alignSelf: 'center',

   },

});

module.exports = Workout;

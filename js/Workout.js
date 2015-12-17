'use strict';

var React = require('react-native');
var { Timermanager } = require('NativeModules');
var Summary = require('./Summary');
var PreWorkout = require('./PreWorkout');


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
  NativeAppEventEmitter,
} = React;


var target = "Running";
var speedData = [];
var timeData = [];
var elevationData = [];
var pointCounts = 0;
var subscriptionBLE,subscriptionTimer;
var heartBeatDatacount=0;
var heartBeatData = [];
var timeData_heart = [];

var Workout = React.createClass({

	watchID: (null: ?number),

	getInitialState: function() {
    return {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      initialSpeed : 'unknown',
      hearBeatData:[],
      timeData_heart:[],
      altitudeValue:'unknown',
    };
  	},

	componentDidMount: function() {

  subscriptionBLE = NativeAppEventEmitter.addListener("receivedBLEData", (data) => { 
        
        navigator.geolocation.getCurrentPosition(
        (initialPosition) => this.setState({initialPosition}),
        (error) => { 
        alert(error.message)},
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
      this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
        this.setState({lastPosition});
        });

        console.log("app event emitter: receivedBLEData:", data.value);
        heartBeatData.push(data.value);
        heartBeatDatacount = heartBeatDatacount +1;
        timeData_heart.push(heartBeatDatacount.toString());
        console.log("HeartBeat-->"+data.value+" Time-->"+heartBeatDatacount);
        this.setState({BLEData : data.value});
        });
  console.log("Timer starting...");
  Timermanager.startTimer();

  subscriptionTimer = NativeAppEventEmitter.addListener("timerData", (data) => { 
        
        console.log("TimerData:", data.secData," : ",data.minData," : ",data.hourData);
        this.setState({secData : data.secData});
        this.setState({minData : data.minData});
        this.setState({hourData : data.hourData});
        this.getLocationData(this.state.lastPosition.coords);
        });


		AsyncStorage.getItem("targetWorkoutOption").then((value) => {
      	console.log("Target value.."+value);
      	target = value;
      	this.setState({"targetWorkoutOption": value});
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
    	speedData=[];
      timeData=[];
      heartBeatData=[];
      timeData_heart=[];
      pointCounts=0;
      heartBeatDatacount=0;
      Timermanager.resetTimer();
      navigator.geolocation.clearWatch(this.watchID);
 	},
  
  componentWillUnmount: function(){
      //Timermanager.resetTimer();
      subscriptionTimer.remove();
      subscriptionBLE.remove();
  },

 	getLocationData: function(coordinates) {
    
    var speed = JSON.stringify(coordinates,['altitude']);
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
        if(timeValue<10 || timeValue%10==0)
        {
          console.log("time value-->"+timeValue);
          speedData.push(speedInFloat.toString());
          timeData.push(timeValue.toString());  
        }
      }
      console.log("Location data is called"+speedInFloat);
      this.setState({altitudeValue:speedInFloat});
      return;// speedInFloat; 
    }
    else
      return;// 0.000; 
    },

 	saveData: function(key,value) {
    //console.log(key+" :storing :"+value);
    AsyncStorage.setItem(key, value);
    this.setState({key : value});
  },

 	onStopPressed: function(){
 	  this.props.navigator.replace({
            component: Summary,
            passProps:{speed : speedData,timeData : timeData,
              heartBeatData : heartBeatData,timeData_heart : timeData_heart},
          }
 			);
 	},

	
	render: function(){
    //speedData= [];
    //timeData=[];
		//console.log("Reaching...");
		//console.log("SpeedData->"+speedData+" TimeData"+timeData+" pointCounts"+pointCounts);
    
    
		return(
			<View style={styles.wholeScreen}>
          <View style={styles.container}>
          <Text style={styles.title}>Time: {this.state.hourData}:{this.state.minData}:{this.state.secData}</Text>
          <Text>------------------------------</Text>
          <Text style={styles.title}>Target : {target}</Text>
          <Text>------------------------------</Text>
          <Text style={styles.title}>HeartBeat : {this.state.BLEData}</Text>

          
          </View>
          <TouchableHighlight onPress={(this.onStopPressed)} underlayColor="#EEEEEE" style={styles.button}>
          <Text style={styles.buttonText}>Stop</Text>
          </TouchableHighlight>
          <Text style={styles.instructionFont}>The location data is being taken. {'\n'}Altitude Value :{this.state.altitudeValue}</Text>
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

module.exports = Workout;

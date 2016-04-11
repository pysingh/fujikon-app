'use strict';

var React = require('react-native');
var { Timermanager } = require('NativeModules');
var Summary = require('./Summary');
var PreWorkout = require('./PreWorkout');
var Subscribable = require('Subscribable');
var AndroidGeolocationModule = require('react-native').NativeModules.AndroidGeolocation;
var TimerManagerAndroid = require('react-native').NativeModules.TimerModule;


var {  
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableHighlight,
  PickerIOS,
  AsyncStorage,
  Platform,
  AlertIOS,
  DeviceEventEmitter,
  NativeAppEventEmitter,
} = React;


var target = "Running";
var elevationData = [];
var timeData = [];
var elevationData = [];
var speedData = [];
var timeDataForSpeed = [];
var pointCounts = 0;
var subscriptionBLE,subscriptionTimer;
var BLEListener, TimerListener;
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
      //hearBeatData:[],
      //timeData_heart:[],
      BLEData : '0',
      altitudeValue:'unknown',
      secData : '0',
      minData : '0',
      hourData : '0',
    };
  	},

	componentDidMount: function() {
if(Platform.os == 'ios'){
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
  }else
        {
          console.log("starting timer js");
          TimerManagerAndroid.startTimer();
          AndroidGeolocationModule.getCurrentLocation(
          (altitude) => {
            
            // console.log(altitude);
            /*console.log(JSON.parse(msg));*/
            /*console.log(altitude);*/
            /*console.log("location trackng  " + msg);*/
          },
          (x) => {
            console.log("location trackng error: " + x);
          }
        );
      /* navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });*/ 
    } 

  subscriptionTimer = NativeAppEventEmitter.addListener("timerData", (data) => { 
        
        console.log("TimerData:", data.secData," : ",data.minData," : ",data.hourData);
        this.setState({secData : data.secData});
        this.setState({minData : data.minData});
        this.setState({hourData : data.hourData});
        this.getLocationData(this.state.lastPosition.coords);
        //this.getSpeedData(this.state.lastPosition.coords);
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
      if(Platform.os == 'ios'){
      	navigator.geolocation.getCurrentPosition(
        	(initialPosition) => this.setState({initialPosition}),
        	(error) => { 
          alert(error.message)},
        	{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        	);
      	this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
        	this.setState({lastPosition});
      });
    }

 	},
  mixins: [Subscribable.Mixin],
	componentWillMount: function() {
    BLEListener = this.addListenerOn(DeviceEventEmitter,
                       'heart_rate',
                       this.onHeartRateDataAvailable);
    TimerListener = this.addListenerOn(DeviceEventEmitter,
                       'time',
                       this.onClockTick);
    	elevationData=[];
      timeData=[];
      heartBeatData=[];
      timeData_heart=[];
      pointCounts=0;
      heartBeatDatacount=0;
      if(Platform.os == 'ios'){
      Timermanager.resetTimer();}
      navigator.geolocation.clearWatch(this.watchID);

      subscriptionBLE = NativeAppEventEmitter.addListener("connectionStatus", (data) => {
    
    console.log("Connection status has been changed...");
    this.setState({connectionState:data.status});
    // AsyncStorage.setItem("connectionStatus", data.status);
  });
 	},
  
  componentWillUnmount: function(){
      //Timermanager.resetTimer();
      // subscriptionBLE = NativeAppEventEmitter.addListener("connectionStatus", (data) => {
      // this.props.connectionStatus = data.status;
      //   });
    //this.setState({connectionState:data.status});
      console.log("Removing subscriptions....")
      subscriptionTimer.remove();
      subscriptionBLE.remove();
      BLEListener.remove();
      TimerListener.remove();

  },
  onHeartRateDataAvailable:function(data: Event) {
    console.log(data)
    heartBeatData.push(data);
        heartBeatDatacount = heartBeatDatacount +1;
        timeData_heart.push(heartBeatDatacount.toString());
        this.setState({BLEData : data});

    /*this.props.BLEConnectionModule.showToast();*/
  },
  onClockTick:function(data: Event) {
    console.log("on clock tick");
    console.log(data);
    var time = secondsToTime(parseInt(data));
    console.log("TimerData:", time.s," : ",time.h," : ",time.m);
        this.setState({secData : time.s});
        this.setState({minData : time.m});
        this.setState({hourData : time.h});
        timeData.push(data.toString());
        AndroidGeolocationModule.getCurrentLocation(
          (altitude) => {
            elevationData.push(altitude.toString());
          },
          (x) => {
            console.log("location trackng error" + x);
          }
        );

        // this.getLocationData(this.state.lastPosition.coords);
  },
 	getLocationData: function(coordinates) {
    
    var elevation = JSON.stringify(coordinates,['altitude']);
    var timeValue ;
    pointCounts = pointCounts +1;
    elevation = (elevation +'');
    elevation = elevation.split(":"); 
    if(elevation)
    {
      var elevationInFloat = parseFloat(elevation[1]).toFixed(2);
      if(elevationInFloat.toString() != 'NaN')
      {
        timeValue = pointCounts;
        elevationInFloat = parseFloat(elevationInFloat*3.28).toFixed(2); //Converting meters to feet.
        if(timeValue<10 || timeValue%10==0)
        {
          console.log("elevation value-->"+elevationInFloat);
          elevationData.push(elevationInFloat.toString());
          timeData.push(timeValue.toString());  
        }
      }
      //console.log("Location data is called"+elevationInFloat);
      this.setState({altitudeValue:elevationInFloat});
      return;// elevationInFloat; 
    }
    else
      return;// 0.000; 
    },

    getSpeedData: function(coordinates) {
    
    var speed = JSON.stringify(coordinates,['speed']);
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
        speedInFloat = parseFloat(speedInFloat).toFixed(2); 
        if(timeValue<10 || timeValue%10==0)
        {
          console.log("speed value-->"+speedInFloat);
          speedData.push(speedInFloat.toString());
          timeDataForSpeed.push(timeValue.toString());  
        }
      }
      //this.setState({altitudeValue:speedInFloat});
      return;
    }
    else
      return;
    },

 	// saveData: function(key,value) {
  //   //console.log(key+" :storing :"+value);
  //   AsyncStorage.setItem(key, value);
  //   this.setState({key : value});
  // },

 	onStopPressed: function(){
    if(Platform == 'ios'){
    this.props.navigator.replace({
            component: Summary,
            passProps:{elevationData : elevationData,timeData : timeData,speedData:speedData,
              timeDataForSpeed:timeDataForSpeed,
              heartBeatData : heartBeatData,timeData_heart : timeData_heart},
              // connectionStatus : this.props.connectionStatus},
          }
 			);
    }else{
      heartBeatData = [60,70,80,70,67,50,60,70,80,70,67,50,60];
      timeData = [1,2,3,4,5,6,7,8,9,10,11,12,13];
      TimerManagerAndroid.resetTimer();
       this.props.navigator.replace({
      id: 'Summary',
      passProps:{elevationData : elevationData,timeData : timeData,speedData:speedData,
              timeDataForSpeed:timeDataForSpeed,
              heartBeatData : heartBeatData,timeData_heart : timeData_heart}
    }); 
    }
 	},

	render: function(){
		//console.log("Reaching...");
		//console.log("SpeedData->"+speedData+" TimeData"+timeData+" pointCounts"+pointCounts);
    
    
		return(
			<View style={styles.wholeScreen}>
          <View style={styles.container}>
          <Text style={styles.timeFont}>TIME: {this.state.hourData}:{this.state.minData}:{this.state.secData}</Text>
          </View>
          <View style={styles.seperator}>
          </View>
          <View style={styles.container}>
          <Text style={styles.timeFont}>TARGET : {this.state.targetWorkoutOption}</Text>
          </View>
          <View style={styles.seperator}>
          </View>
          <View style={styles.container}>
          <Text style={styles.timeFont}>HEARTBEAT : {this.state.BLEData}</Text>
          </View>
          <TouchableHighlight onPress={(this.onStopPressed)} underlayColor="#EEEEEE" style={styles.button}>
          <Text style={styles.buttonText}>Stop</Text>
          </TouchableHighlight>
          <Text style={styles.instructionFont}>The location data is being taken. {'\n'}Altitude Value :{this.state.altitudeValue}</Text>
        </View>
		);

	}


});

function secondsToTime(secs)
{
  secs = Math.round(secs);
  var hours = Math.floor(secs / (60 * 60));

  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);

  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);

  var obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
  };
  //console.log(obj.h + obj.m + obj.s);
  return obj;
}

var styles = StyleSheet.create({
  bigTitle:{
    fontWeight: '500',
    fontSize: 30,
  },
  title: {
    fontWeight: '500',
    fontSize : 18,
  },
  seperator: {
    height: 1,
    flexDirection:'row',
    backgroundColor : 'black'
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
    flex: 0.2,
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
  timeFont:{
    fontFamily: 'Trebuchet MS',
    fontSize: 30,
    color:'gray'
  },
});

module.exports = Workout;

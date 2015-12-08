'use strict';

var React = require('react-native');
var DrawGraphs = require('./DrawGraph');
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
} = React;

var target = "Time";
var activity,workout;
//var speedData = [];


var Summary = React.createClass({

	componentDidMount : function(){
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

  onWorkoutAgainPressed: function(){
    //this.props.timeData =[];
    //this.props.speed = [];
    this.props.navigator.replace({
            component: PreWorkout,
            
          }
      );
  },

	render: function(){
		return(
			<View>
          <View style={styles.graphContainer}>
          <Text style={styles.bigTitle}>Summary</Text>
          <Text style={styles.title}>Activity : {activity}</Text>
          <Text style={styles.title}>Workout : {workout}</Text>
          <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={(this.onWorkoutAgainPressed)} style={styles.button}>
          <Text style={styles.buttonText}>Workout Again</Text>
          </TouchableHighlight>
          </View>
          <DrawGraphs {...this.props} xAxisName="time(in secs)" yAxisName="elevation(in feet)" xData={this.props.timeData} yData={this.props.speed}/>
          </View>
        </View>
		);

	},

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
    flex: 1,
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
module.exports =  Summary;


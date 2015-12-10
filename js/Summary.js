'use strict';

var React = require('react-native');
var DrawGraphs = require('./DrawGraph');
var TargetOptions = require('./TargetOptions');


var {  
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableHighlight,
  PickerIOS,
  AsyncStorage,
  ScrollView,
} = React;

var target = "Time";
var activity,workout;
//var speedData = [];


var Summary = React.createClass({

	getInitialState: function() {
    return { 
      targetOptions :[{id:0,value:'Elevation'},{id:1,value:'Speed'},{id:2,value:'HeartBeat'}],
      currentOption : 0,
      graphValue : 0,
    };
  },

  componentDidMount : function(){
	 AsyncStorage.getItem("targetWorkoutOption").then((value) => {
        //console.log("Target value.."+value);
        target = value;
        this.setState({"targetWorkoutOption": value});
      }).done();

    AsyncStorage.getItem("selectedActivity").then((value) => {
      //console.log("Async value "+value);
      activity=value;
      this.setState({"selectedActivity": value});
    }).done();

    AsyncStorage.getItem("selectedWorkout").then((value) => {
      //console.log("Async value "+value);
      workout=value;
      this.setState({"selectedWorkout": value});
    }).done();
	},

   _optionChanged: function(option){
    console.log("Target changed"+option);
    this.setState({currentOption: option});
    //this.saveData("targetWorkoutOption",targetOptions.option);
    if(option==0){
      //this.saveData("targetWorkoutOption","Time");
      console.log("0");
      this.setState({graphValue:0});
    }
    else if(option==1){
      console.log("1");
      this.setState({graphValue:1});
    }
    else{
      console.log("2");
      this.setState({graphValue:2});
      this.render;
    }
    

  },


  onWorkoutAgainPressed: function(){
    var PreWorkout = require('./PreWorkout');

    this.props.navigator.replace({
            component: PreWorkout,
            
          }
      );
  },

	render: function(){
		var graphValue = this.state.graphValue;
    if(graphValue==0)
    return(
			<ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        style={styles.scrollView}>
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
          </View>
        
          <PickerIOS
                selectedValue={this.state.currentOption}
                onValueChange={this._optionChanged}>
                {
                  this.state.targetOptions.map((item)=> (
                      <PickerIOS
                        key={'_'+item.id}
                        value={item.id}
                        label={item.value}
                        style={styles.item}/>
                    ))
                }
            </PickerIOS>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={true}
                style={[styles.scrollView, styles.horizontalScrollView]}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={true}
                scrollEventThrottle={500}
                >
            <View style={styles.latterHalf}>
              
              <DrawGraphs {...this.props} xAxisName="time(in secs)" yAxisName="elevation(in feet)" xData={this.props.timeData} yData={this.props.speed}/>
              
          </View>
          </ScrollView>
        </View>
        </ScrollView>
		);
    else if(graphValue == 1)
      return(
      <ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        style={styles.scrollView}>
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
          </View>
          
          <PickerIOS
                selectedValue={this.state.currentOption}
                onValueChange={this._optionChanged}>
                {
                  this.state.targetOptions.map((item)=> (
                      <PickerIOS
                        key={'_'+item.id}
                        value={item.id}
                        label={item.value}
                        style={styles.item}/>
                    ))
                }
            </PickerIOS>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={true}
                style={[styles.scrollView, styles.horizontalScrollView]}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={true}
                scrollEventThrottle={500}
                >
            <View style={styles.latterHalf}>

          
            <Text>No Data to show.</Text>
          </View>
          </ScrollView>
        </View>
        </ScrollView>
    );
  else
    return(
      <ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        style={styles.scrollView}>
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
          </View>
        
          <PickerIOS
                selectedValue={this.state.currentOption}
                onValueChange={this._optionChanged}>
                {
                  this.state.targetOptions.map((item)=> (
                      <PickerIOS
                        key={'_'+item.id}
                        value={item.id}
                        label={item.value}
                        style={styles.item}/>
                    ))
                }
            </PickerIOS>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={true}
                style={[styles.scrollView, styles.horizontalScrollView]}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={true}
                scrollEventThrottle={500}
                >
            <View style={styles.latterHalf}>
              
              <DrawGraphs {...this.props} xAxisName="time(in secs)" yAxisName="Heartbeat(bpm)" xData={this.props.timeData_heart} yData={this.props.heartBeatData}/>
            </View>
            </ScrollView>
        </View>
        </ScrollView>
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
  subContainer: {
    flex:1,
    padding: 30,
    marginTop: 5,
    alignItems: "stretch"
  },
  wholeScreen:{
    //backgroundColor: '#F5FCFF',
    flex :1,
    //flexDirection:'row',
    alignItems:'stretch',
    justifyContent:'center',
    marginTop: 70,
    marginBottom:20,
    //flexDirection: 'row',
  },
  scrollView: {
    height: 300,
  },
  horizontalScrollView: {
    height: 600,
    //flex:1,
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
  latterHalf:{
    flex:1,
    alignItems:'center'
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
  item:{
    flex : 1,
    height: 50,
  },
});


module.exports =  Summary;


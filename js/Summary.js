'use strict';

var React = require('react-native');
var DrawGraphs = require('./DrawGraph');
var TargetOptions = require('./TargetOptions');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

var {  
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableHighlight,
  PickerIOS,
  Platform,
  AsyncStorage,
  ScrollView,
  NativeAppEventEmitter,
} = React;

var target = "Time";
var activity,workout;
var x=[];
var y=[];
var subscriptionBLE;
//var speedData = [];
var KenBurnsView = require('./CustomView');

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

  componentWillMount : function(){
    subscriptionBLE = NativeAppEventEmitter.addListener("connectionStatus", (data) => {
        console.log("Connection status has been changed...");
        this.setState({connectionState:data.status});
    // AsyncStorage.setItem("connectionStatus", data.status);
  });
  },
   _optionChanged: function(option){
    //console.log("Target changed"+option);
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
    var state = this.props.connectionStatus;
    if(Platform.os == 'ios'){
      this.props.navigator.replace({
              component: PreWorkout,
              // passProps: {connectionStatus : state},
            }
        );
    }else{
      this.props.navigator.push({
      id: 'PreWorkout'
    });
    }
  },

	render: function(){
    //console.log("Speed data -->",this.props.speed,"Time data -->",this.props.timeData);
		var graphValue = this.state.graphValue;
    var graphDataAndroid = this.props.obj;
    graphDataAndroid = JSON.stringify(graphDataAndroid);
    if(graphValue==0)
    return(
			<ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        style={styles.scrollView}>
      <View style={styles.container}> 
          <View style={styles.graphContainer}>
            <Text style={styles.bigTitle}>Summary</Text>
            <Text style={styles.title}>Activity : {activity}</Text>
            <Text style={styles.title}>Workout : {workout}</Text>
          </View>
          <View style={styles.buttonContainer}>
              <TouchableHighlight onPress={(this.onWorkoutAgainPressed)} style={styles.button}>
              <Text style={styles.buttonText}>Workout Again</Text>
              </TouchableHighlight>
          </View>
          <View style={styles.pickerOneStyle}>
          <PickerIOS
                style={styles.pickerStyle}
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
            </View>
            <View ref="Graphview">
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={true}
                style={styles.horizontalScrollView}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={true}
                scrollEventThrottle={500}
                >
        <KenBurnsView source={graphDataAndroid} style={{width, height:200 }}/>
          </ScrollView>
          </View>
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
      <View style={styles.container}> 
          <View style={styles.graphContainer}>
            <Text style={styles.bigTitle}>Summary</Text>
            <Text style={styles.title}>Activity : {activity}</Text>
            <Text style={styles.title}>Workout : {workout}</Text>
          </View>
          <View style={styles.buttonContainer}>
              <TouchableHighlight onPress={(this.onWorkoutAgainPressed)} style={styles.button}>
              <Text style={styles.buttonText}>Workout Again</Text>
              </TouchableHighlight>
          </View>
          <View style={styles.pickerOneStyle}>
          <PickerIOS
                style={styles.pickerStyle}
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
            </View>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={true}
                style={styles.horizontalScrollView}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={true}
                scrollEventThrottle={500}
                >
        <KenBurnsView source={graphDataAndroid} style={{width, height }}/>
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
      <View style={styles.container}> 
          <View style={styles.graphContainer}>
            <Text style={styles.bigTitle}>Summary</Text>
            <Text style={styles.title}>Activity : {activity}</Text>
            <Text style={styles.title}>Workout : {workout}</Text>
          </View>
          <View style={styles.buttonContainer}>
              <TouchableHighlight onPress={(this.onWorkoutAgainPressed)} style={styles.button}>
              <Text style={styles.buttonText}>Workout Again</Text>
              </TouchableHighlight>
          </View>
          <View style={styles.pickerOneStyle}>
          <PickerIOS
                style={styles.pickerStyle}
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
            </View>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                horizontal={true}
                style={styles.horizontalScrollView}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={true}
                scrollEventThrottle={500}
                >
        <KenBurnsView source={graphDataAndroid} style={{width, height }}/>
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
  pickerOneStyle: {
    alignItems:"center",
  },
  pickerStyle : {
    width:width,
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
    height: 300,
    // width: 300,
    //backgroundColor: '#43878',
    left:0,
    right:0,
    //flex:1,
  },
  buttonContainer:{
    alignItems:'stretch',
    flex:1,
    //justifyContent:'center',
    marginTop:10,
  },
  container: {
    //flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',

    //backgroundColor: '#F5FCFF',
    
    //height : 300,
    //marginTop:10,
    //marginBottom:10,
  },
  latterHalf:{
    flex:1,
    // alignItems:'center',
    //width: 1000,
    backgroundColor: '#0000FF',
    //justifyContent:'center',
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
    width:320,
  },
});


module.exports =  Summary;


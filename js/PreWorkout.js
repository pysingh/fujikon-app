'use strict';

var React = require('react-native');
var { SMBLEManager } = require('NativeModules');

var ActivityOptions = require('./ActivityOptionListView');
var WorkoutOptions = require('./WorkoutOptionsListView');
var Geo = require('./Geolocation');


var count = 0;
var listOptions = ['Activity','Workout'];
var activityName = "Running";
var workoutName = "Just Track Me";
var subTitle=[activityName,workoutName];


var {
  Image,
  ListView,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage,
  Text,
  View,
  NativeAppEventEmitter,
} = React;

var ListViewSimpleExample = React.createClass({

  statics: {
    title: '<ListView> - Simple',
    description: 'Performant, scrollable list of data.'
  },

  getInitialState: function() {
    //console.log("Initialization..");
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['row1','row2']),
      dataSourceForActivity: ds.cloneWithRows(['row1','row2','row3']),
      selectedActivity:"Running",
    };


  },

  refreshActivityData: function(data) {
  // console.log(this.state);
    this.setState({selectedActivity:data});

  },
  refreshWorkoutData: function(data) {
  // console.log(this.state);
  this.setState({selectedWorkout:data});

},


componentDidMount: function(){
  //console.log("Did Mounting...");

},

componentWillMount:function(){
  //console.log("Mounting..."+subTitle);
  AsyncStorage.getItem("selectedActivity").then((value) => {
      //console.log("Async value "+value);
      activityName = value;
      this.setState({"selectedActivity": value});
    }).done();
  AsyncStorage.getItem("selectedWorkout").then((value) => {
      //console.log("Async value "+value);
      workoutName=value;
      this.setState({"selectedWorkout": value});
    }).done();
  //activityName = this.state.selectedActivity;
},

getOptions: function(){

    //activityName = this.state.selectedActivity;
    console.log("Get Options called.."+activityName);
    return (

      <TouchableHighlight onPress={(this.onTabPressed.bind(this,count))} underlayColor="#EEEEEE">
      <View style={styles.container}>
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{listOptions[count++]}</Text>
      <Text style={styles.year}>{this.state.intialValue}</Text>
      <View style={styles.separator} />
      </View>
      </View>
      
      </TouchableHighlight>

      );
    count++;
  },
  onStartPressed: function(){
    SMBLEManager.initParameters("180D","2A37");
    
    

    var Workout = require('./Workout');

    this.props.navigator.replace({
      component: Workout,
      componentConfig : {
        title : "My New Title"
      },
    });  

  },

  onTabPressed: function(rowID){
    console.log("Tab pressed...."+rowID);
    if(rowID==0)
    {
      this.props.navigator.push({
        component: ActivityOptions,
        backButtonTitle: 'Back',
        passProps : {obj: this},
        componentConfig : {
          title : "My New Title"
        },
      });
    }
    else
    {
      this.props.navigator.push({
        component: WorkoutOptions,
        backButtonTitle: 'Back',
        passProps : {obj: this}, 
        componentConfig : {
          title : "My New Title"
        },
      });
    }


  },

  render: function() {
    AsyncStorage.getItem("selectedActivity").then((value) =>{activityName=value});
    console.log("this is called.."+activityName);
    if(count!=0)
      count=0;
    return (
      <View style ={styles.screenContainer}>
          <View style = {styles.container}>
          <TouchableHighlight onPress={(this.onTabPressed.bind(this,count))} underlayColor="#EEEEEE">
            <View style={styles.container}>
              <View style={styles.rightContainer}>
              <Text style={styles.title}>{listOptions[count++]}</Text>
              <Text style={styles.year}>{this.state.selectedActivity}</Text>
              </View>
              <View style={styles.separator} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={(this.onTabPressed.bind(this,count))} underlayColor="#EEEEEE">
            <View style={styles.container}>
              <View style={styles.rightContainer}>
              <Text style={styles.title}>{listOptions[count++]}</Text>
              <Text style={styles.year}>{this.state.selectedWorkout}</Text>
              <View style={styles.separator} />
              </View>
            </View>
          </TouchableHighlight>             
        </View>
      <View style={styles.bottomContainer}>
      <TouchableHighlight onPress={(this.onStartPressed)} underlayColor="#EEEEEE" style={styles.button}>
      <Text style={styles.buttonText}>Start</Text>
      </TouchableHighlight>
      </View>
      </View>
      );

},

});

var styles = StyleSheet.create({
  listView: {
    paddingTop: 30,
        //backgroundColor: '#F5FCFF',
        height:200,
      },
      screenContainer:{
        paddingTop:50,
      },
      container: {
        flex: 1,
        //flexDirection: 'row',
        marginTop:10,
        alignItems: 'stretch',
        justifyContent: 'center',        //backgroundColor: '#F5FCFF',
      },
      rightContainer: {
        flex: 1,
        height: 70,
        alignItems : 'center',
        justifyContent: 'center',
      },
      bottomContainer:{
        flex:1,
        justifyContent: 'flex-end',
        marginBottom:100,
      },
      title: {
        fontSize: 20,
        marginBottom: 6,
        textAlign: 'center',
      },
      year: {
        textAlign: 'center',
      },
      button: {
        height: 40,
        flex: 1,
        backgroundColor: "#FCB130",
        borderColor: "#555555",
    //borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    marginRight: 15,
    marginLeft: 15,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    alignSelf: "center"
  },
  separator: {
    height: 1,
    backgroundColor:"#7C7C7C",
    marginRight:50,
    marginLeft:50,
  },
});
module.exports = ListViewSimpleExample;
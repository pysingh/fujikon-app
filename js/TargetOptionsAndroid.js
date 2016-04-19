'use strict';

var React = require('react-native');
var TargetOptions = require('./TargetOptions');
var {
  ListView,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Navigator,
  StyleSheet,
  Text,
  AsyncStorage,
  Platform,
  View,
} = React;

var workoutCount = 0;
var targetOptions = ['Time','Distance','Calories'];
var WorkoutOptionsListView = React.createClass({

getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['row1','row2','row3']),
      dataSourceForActivity: ds.cloneWithRows(['row1','row2']),

  };
},
componentDidMount: function() {
    AsyncStorage.getItem("targetWorkoutOption").then((value) => {
      console.log("Async value "+value);
      this.setState({"targetWorkoutOption": value});
    }).done();
},

saveData: function(key,value) {
    AsyncStorage.setItem(key, value);
    this.setState({key : value});
},

onTabPressed: function(option){
    // console.log("Tab pressed..");
    // this.saveData("selectedWorkout",workoutOptions[rowID]);
    // if(Platform.os == 'ios'){
    // if(rowID==1)
    //   this.props.navigator.push({
    //     component : TargetOptions,
    //     });
    // }else{
    //   if(rowID==1)
    //   this.props.navigator.push({
    //     id: 'TargetOptions',
    //     name: 'TargetOptions'     
    //     });
    // }
    // this.props.obj.refreshWorkoutData(workoutOptions[rowID]);
    // this.props.navigator.pop();
    if(option==0){
      this.saveData("targetWorkoutOption","Time");
      
    }
    else if(option==1){
      this.saveData("targetWorkoutOption","Distance");
    }
    else{
      this.saveData("targetWorkoutOption","Calories");
    }
   // console.log(this.props);
    this.props.obj(targetOptions[option]);
    // this.props.obj.refreshWorkoutData("test");
    this.props.navigator.popToTop();

},
getOptions: function(){
    
    console.log("Options rendering....");    
    return (
      <TouchableHighlight onPress={(this.onTabPressed.bind(this,workoutCount))} underlayColor="#EEEEEE">
      
      
      <View style={styles.rightContainer}>
      <View style={styles.separator} />
      <Text style={styles.title}>{targetOptions[workoutCount++]}</Text>
      
      
      
      </View>
      </TouchableHighlight>
      );
    
},

render: function() {
    console.log("Workout Options:");
    if(workoutCount!=0)
      workoutCount=0;
if(Platform.OS == 'ios'){
      return (
       this.renderScene()
      );
    }else{
      return(
      <Navigator
          ref = "NavBar"
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#FCB130', alignItems: 'center'}}
                routeMapper={NavigationBarRouteMapper} />
          } />);
    }
},
renderScene: function(){
  return (
        <ListView
        //automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this.getOptions}//{(rowData) => <Text>{rowData}</Text>}
        style = {styles.listView}/>             
    );
},
});
var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
     return (
        <TouchableOpacity onPress={() => navigator.parentNavigator.pop()} style={{flex: 1, justifyContent: 'center'}}> 
        <Image
          source={{uri: 'http://facebook.github.io/react/img/logo_og.png'}}
          style={styles.base}/>
        </TouchableOpacity>    
      );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Trget Options
        </Text>
      </TouchableOpacity>
    );
  }
};
var styles = StyleSheet.create({
	listView: {
        paddingTop: 30,
        //backgroundColor: '#F5FCFF',
        height:100,
    },
    base: {
        width: 35,
        height: 35,
      },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height: 50,
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        height: 60,
        //textAlign: 'center',
    },
    bottomContainer:{
        flex:1,
        justifyContent: 'flex-end',
        marginBottom:200,
    },
    title: {
        fontSize: 20,
        //marginBottom: 8,
        textAlign: 'center',
    },
    year: {
        textAlign: 'center',
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
    height: 1,
    backgroundColor: '#dddddd',
    alignSelf: 'flex-end'
  },

});

module.exports = WorkoutOptionsListView;
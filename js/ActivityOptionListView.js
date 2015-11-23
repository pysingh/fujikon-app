'use strict';

var React = require('react-native');
var PreWorkout = require('./PreWorkout');
var {
  ListView,
  TouchableHighlight,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
} = React;

var activityCount = 0;
var activityOptions = ['Running','Walking','Cycling','Treadmil'];

var ActivityOptionsListView = React.createClass({

 
getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['row1','row2','row3','row4']),
      dataSourceForActivity: ds.cloneWithRows(['row1','row2']),

  };
},

componentWillMount: function(){
     AsyncStorage.getItem("selectedActivity").then((value) => {
      console.log("Async value "+value);
      this.setState({"selectedActivity": value});
    }).done();
},

getOptions: function(){
    //console.log("Activity Options Rendering..");
     
    return (
      <TouchableHighlight onPress={(this.onTabPressed.bind(this,activityCount))}>
      <View style={styles.container}>
      <View style={styles.rightContainer}>
      <View style={styles.separator} />
      <Text style={styles.title}>{activityOptions[activityCount++]}</Text>
      </View>
      </View>
      </TouchableHighlight>
      );
    
},

saveData: function(key,value) {
    AsyncStorage.setItem(key, value);
    console.log("Data saved for key "+key+" value "+value);
    this.setState({key : value});
},

onTabPressed: function(rowID){
    console.log("array : "+activityOptions+"count :"+rowID);
    this.saveData("selectedActivity",activityOptions[rowID]);
    console.log("Delegation..."+PreWorkout.activityName);
    this.props.navigator.pop();

},

render: function() {
    //console.log("Activity Running");
    if(activityCount!=0)
      activityCount=0;
    return (
        <ListView

        dataSource={this.state.dataSource}
        renderRow={this.getOptions}//{(rowData) => <Text>{rowData}</Text>}
        style = {styles.listView}/>             
    );


},
});

var styles = StyleSheet.create({
  listView: {
        paddingTop: 15,
        backgroundColor: '#F5FCFF',
        height:100,
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
        //textAlign: 'center',
    },
    bottomContainer:{
        flex:1,
        justifyContent: 'flex-end',
        marginBottom:200,
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
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

module.exports = ActivityOptionsListView;
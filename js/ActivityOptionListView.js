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
      activityName : '',

  };
},

componentWillMount: function(){
     AsyncStorage.getItem("selectedActivity").then((value) => {
      //console.log("Async value "+value);
      this.setState({"selectedActivity": value});
    }).done();
},

getOptions: function(){
    //console.log("Activity Options Rendering..");
     
    return (
      <TouchableHighlight onPress={(this.onTabPressed.bind(this,activityCount))} underlayColor="#EEEEEE">
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{activityOptions[activityCount++]}</Text>
      <View style={styles.separator} />
      </View>
      </TouchableHighlight>
      );
    
},

saveData: function(key,value) {
    AsyncStorage.setItem(key, value);
    //console.log("Data saved for key "+key+" value "+value);
    this.setState({key : value});
},

onTabPressed: function(rowID){
    //console.log("array : "+activityOptions+"count :"+rowID);
    {this._onValueChange(activityOptions[rowID])};
    this.saveData("selectedActivity",activityOptions[rowID]);
    //console.log("Delegation..."+PreWorkout.activityName);
    // console.log(this.props.obj);
    // this.props.obj.setState({initialValue:"Walking"});

    // console.log(this.props.obj.state.intialValue);
    //console.log(this.props.obj);
    this.props.obj.refreshActivityData(activityOptions[rowID]);

    this.props.navigator.pop();

},

_onValueChange: function (selectedValue) {
    console.log("Activity changed to ",selectedValue);
    AsyncStorage.setItem("activityName", selectedValue);
    console.log("1");

    AsyncStorage.getItem("activityName").then((value) => {
      //console.log("Async value "+value);
      //activityName = value;
      this.setState({"activityName": value});
    }).done();
    console.log("this.state.activityName ", this.state.activityName);
    // this.setState({selectedValue});
    // try {
    //   console.log("2");
    //   AsyncStorage.setItem("activityName", selectedValue);
    //   console.log("this.state.activityName ", this.state.activityName);
    //   //this._appendMessage('Saved selection to disk: ' + selectedValue);
    // } 
    // catch (error) {
    //   //this._appendMessage('AsyncStorage error: ' + error.message);
    // }
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
        paddingTop: 30,
        //backgroundColor: '#F5FCFF',
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:60,
        //backgroundColor: '#F5FCFF',
        //textAlign: 'center',
    },
    bottomContainer:{
        flex:1,
        justifyContent: 'flex-end',
        marginBottom:200,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd',
        alignSelf: 'flex-end'
  },

});

module.exports = ActivityOptionsListView;
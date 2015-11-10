'use strict';

var React = require('react-native');
var count = 0;
var activityCount = 0;
var {
  Image,
  ListView,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} = React;

var ListViewSimpleExample = React.createClass({

  statics: {
    title: '<ListView> - Simple',
    description: 'Performant, scrollable list of data.'
},

getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['row1','row2']),
      dataSourceForActivity: ds.cloneWithRows(['row1','row2','row3']),

  };
},

getOptions: function(){
    var listOptions = ['Activity','Workout'];
    //if(count != 0)
        //count= count +1;
    return (
      <TouchableHighlight onPress={(this.onTabPressed)}>
      <View style={styles.container}>
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{listOptions[count++]}</Text>
      <Text style={styles.year}>Running</Text>
      </View>
      <View style={styles.separator} />
      </View>
      </TouchableHighlight>
      );
    count++;
},
onSubmitPressed: function(){

},

onTabPressed: function(){
    console.log("Tab pressed....");
    return (
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.getActivityOptions}//{(rowData) => <Text>{rowData}</Text>}
        style = {styles.listView}/> 
    );
},

getActivityOptions: function(){
    var activityOptions = ['Running','Walking','Cycling','Treadmil'];
    console.log("Options rendering....");    
    return (
      <TouchableHighlight>
      <View style={styles.container}>
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{activityOptions[activityCount++]}</Text>
      </View>
      <View style={styles.separator} />
      </View>
      </TouchableHighlight>
      );
    
},

render: function() {
    return (
        <View>
        <View style = {styles.container}>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.getOptions}//{(rowData) => <Text>{rowData}</Text>}
        style = {styles.listView}/>             
        </View>
        <View style={styles.bottomContainer}>
            <TouchableHighlight onPress={(this.onSubmitPressed)} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
            </TouchableHighlight>
        </View>
        </View>
    );

},

});

var styles = StyleSheet.create({
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
        height:200,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    rightContainer: {
        flex: 1,
    },
    bottomContainer:{
        flex:1,
        justifyContent: 'flex-end',
        marginBottom:100,
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
    backgroundColor: '#CCCCCC',
  },
});
module.exports = ListViewSimpleExample;
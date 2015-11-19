'use strict';

var React = require('react-native');
var {
  ListView,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} = React;

var workoutCount = 0;

var WorkoutOptionsListView = React.createClass({

getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(['row1','row2','row3']),
      dataSourceForActivity: ds.cloneWithRows(['row1','row2']),

  };
},

getOptions: function(){
    var workoutOptions = ['Just Track Me','Set Target','Target Pace'];
    console.log("Options rendering....");    
    return (
      <TouchableHighlight>
      <View style={styles.container}>
      
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{workoutOptions[workoutCount++]}</Text>
      <View style={styles.separator} />
      </View>
      </View>
      
      </TouchableHighlight>
      );
    
},

render: function() {
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
        alignItems: 'flex-start',
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
    backgroundColor: '#dddddd',
  },

});

module.exports = WorkoutOptionsListView;
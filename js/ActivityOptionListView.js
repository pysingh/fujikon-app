'use strict';

var React = require('react-native');
var {
  Image,
  ListView,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} = React;

var RunningOptionListView = React.createClass({

getOptions: function(){
    var listOptions = ['Running','Walking','Cycling'];
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
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
        height:200,
    },

});
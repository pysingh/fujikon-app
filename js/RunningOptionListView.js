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
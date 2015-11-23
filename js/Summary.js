'use strict';

var React = require('react-native');

var {  
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableHighlight,
  PickerIOS,
  AsyncStorage,
} = React;

var Summary = React.createClass({

	componentDidMount : function(){
	
	},

	render: function(){
		return(
			<View>
				<View style={styles.container}>
					<Text>Summary</Text>
				</View>
			</View>
		);

	},

});

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: "stretch"
  },
  formInput: {
    height: 36,
    padding: 10,
    marginRight: 5,
    marginBottom: 5,
    marginTop: 5,
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555"
  },
  button: {
    height: 36,
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
  item:{
    flex : 1,
    height: 180,
  },
  picker:{
    flex:1,
    height : 36,
  },
 });
module.exports =  Summary;


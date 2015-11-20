'use strict';

var React = require('react-native');
var Geolocation = require('./Geolocation');
var PreWorkout = require('./PreWorkout');

exports.framework = 'React';
exports.title = 'Geolocation';

var {  
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableHighlight,
  AlertIOS,
  PickerIOS,
} = React;

var buttonDisabled = 0;
var UserStats = React.createClass({

  
  componentDidMount: function() {
    console.log(navigator.geolocation+"Ateoiat");
    navigator.geolocation.getCurrentPosition(
      (success)=>{this.buttonDisabled=0;this.setState({buttonDisabled:'0'}); console.log("Geo Success")},
      (error)=>{this.buttonDisabled=0;this.setState({buttonDisabled:'1'}); console.log("Geo Fail"+this.buttonDisabled)},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

    

    AsyncStorage.getItem("name").then((value) => {
      this.setState({"name": value});
    }).done();

    AsyncStorage.getItem("gender").then((value) => {
      this.setState({"gender": value});
    }).done();

    AsyncStorage.getItem("height").then((value) => {
      this.setState({"height": value});
    }).done();

    AsyncStorage.getItem("weight").then((value) => {
      this.setState({"weight": value});
    }).done();
    AsyncStorage.getItem("age").then((value) => {
      this.setState({"age": value});
    }).done();

    
  },

  getInitialState: function() {
    return { 
      gender :'',
      height :'',
      weight :'',
      age :'',
    };
  },

  saveData: function(key,value) {
    AsyncStorage.setItem(key, value);
    this.setState({key : value});
  },

  onSubmitPressed: function(){
    if(this.buttonDisabled === 0)
    {
      this.props.navigator.replace({
            component: PreWorkout,
          });  
    }
    else
    {
      AlertIOS.alert(
            "Enable your location services",
            "The app needs location services to proceed.",
          );
    }
    
  },

  render: function() {
    return (
      <View>
      <View style={styles.container}>
      <TextInput
      placeholder="Gender"
      onChange={(event) => this.setState({gender: event.nativeEvent.text})}
      style={styles.formInput}/>
      <TextInput
      placeholder="Height"
      onChange={(event) => this.setState({height: event.nativeEvent.text})}
      style={styles.formInput}/>
      <TextInput
      placeholder="Weight"
      onChange={(event) => this.setState({weight: event.nativeEvent.text})}
      style={styles.formInput}/>
      <TextInput
      placeholder="Age"
      onChange={(event) => this.setState({age: event.nativeEvent.text})}
      style={styles.formInput}
      value={this.state.password} />
      <TouchableHighlight onPress={(this.onSubmitPressed)} style={styles.button}>
      <Text style={styles.buttonText}>Submit</Text>
      </TouchableHighlight>
      <Text>Please enable location services in-order to use the app.</Text>
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
  title: {
    fontSize: 18,
    marginBottom: 10
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
});

module.exports = UserStats;
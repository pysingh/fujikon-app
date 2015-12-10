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
  ScrollView,
  Modal,
  SwitchIOS,
} = React;

var buttonDisabled = 0;
var UserStats = React.createClass({

  
  componentDidMount: function() {
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
      genderOptions :[{id:0,value:'Male'},{id:1,value:'Female'}],
      currentGender : 0,
      genderModalVisible: 'false',
      animated: true,
      transparent: true,

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

  _setGenderModalVisible: function(visible) {
    this.setState({genderModalVisible: visible});
  },

  render: function() {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff', padding: 20}
      : null;
    var a=['1','2','3','4'];
      console.log("Array lenght : "+a.length);
    return (
      
      <View>
            


            <View style={styles.container}>
            <TextInput
            placeholder="Gender"
            onChange={this._setGenderModalVisible.bind(this, true)}
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
            <TouchableHighlight onPress={(this.onSubmitPressed)} underlayColor="#EEEEEE" style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
            </TouchableHighlight>
            <Text style={styles.instructionFont}>Please enable location services in-order to use the app.</Text>
            
            </View>
      </View>
      
      );
  },
});

var ModalExample = React.createClass({
  getInitialState() {
    return {
      animated: true,
      modalVisible: false,
      transparent: false,
    };
  },

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  },

  _toggleAnimated() {
    this.setState({animated: !this.state.animated});
  },

  _toggleTransparent() {
    this.setState({transparent: !this.state.transparent});
  },

  render() {
    var modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
    };
    var innerContainerTransparentStyle = this.state.transparent
      ? {backgroundColor: '#fff', padding: 20}
      : null;

    return (
      <View>
        <Modal
          animated={this.state.animated}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}>
          <View style={[styles.container, modalBackgroundStyle]}>
            <View style={[styles.innerContainer, innerContainerTransparentStyle]}>
              <Text>This modal was presented {this.state.animated ? 'with' : 'without'} animation.</Text>
              <Button
                onPress={this._setModalVisible.bind(this, false)}
                style={styles.modalButton}>
                Close
              </Button>
            </View>
          </View>
        </Modal>

        <View style={styles.row}>
          <Text style={styles.rowTitle}>Animated</Text>
          <SwitchIOS value={this.state.animated} onValueChange={this._toggleAnimated} />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowTitle}>Transparent</Text>
          <SwitchIOS value={this.state.transparent} onValueChange={this._toggleTransparent} />
        </View>

        <Button onPress={this._setModalVisible.bind(this, true)}>
          Present
        </Button>
      </View>
    );
  },
});

var Button = React.createClass({
  getInitialState() {
    return {
      active: false,
    };
  },

  _onHighlight() {
    this.setState({active: true});
  },

  _onUnhighlight() {
    this.setState({active: false});
  },

  render() {
    var colorStyle = {
      color: this.state.active ? '#fff' : '#000',
    };
    return (
      <TouchableHighlight
        onHideUnderlay={this._onUnhighlight}
        onPress={this.props.onPress}
        onShowUnderlay={this._onHighlight}
        style={[styles.button, this.props.style]}
        underlayColor="#a9d9d4">
          <Text style={[styles.buttonText, colorStyle]}>{this.props.children}</Text>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: "stretch",
    justifyContent: 'center',
  },
  scrollView: {
    //backgroundColor: '#6A85B1',
    height: 300,

  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  formInput: {
    height: 40,
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
    backgroundColor: "#FCB130",
    borderColor: "#555555",
    //borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 20,
    fontWeight:"500",
    color: "#ffffff",
    alignSelf: "center"
  },
  instructionFont:{
    color: "#7C7C7C",
  },
  item:{
    flex : 1,
    height: 180,
  },
  picker:{
    flex:1,
    height : 36,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  modalButton: {
    marginTop: 10,
  },
});

module.exports = UserStats;
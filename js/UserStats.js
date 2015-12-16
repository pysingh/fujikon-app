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
  DatePickerIOS,
} = React;

var buttonDisabled = 0;
var genderArray=['Male','Female'];
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

  getDefaultProps: function () {
    ///console.log("Date...");
    return {
      date: new Date(),
    };
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
      isGenderOptionsVisible: false,
      isAgeVisible: false,  
      date: this.props.date,
    };
  },

  saveData: function(key,value) {
    AsyncStorage.setItem(key, value);
    this.setState({key : value});
  },
  onDateChange: function(date) {
    this.setState({date: date});
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

  toggleGender: function () {
       // console.log("Toggling...");
        this.setState({
            isGenderOptionsVisible :!this.state.isGenderOptionsVisible,isAgeVisible:false
            
        });        
  },

  _optionChanged: function(option){
    //console.log("Target changed"+option);
    this.setState({currentGender: option});
  },

  _renderGenderOptions: function(){
    //console.log("calledAgain Gender"+this.state.isGenderOptionsVisible);
    if (this.state.isGenderOptionsVisible) {
            return (
                <View style={styles.restContainer} removeClippedSubviews={true}>
                  <PickerIOS
                    selectedValue={this.state.currentGender}
                    onValueChange={this._optionChanged}
                    style={styles.pickerStyle}>
                    {
                      this.state.genderOptions.map((item)=> (
                          <PickerIOS
                            key={'_'+item.id}
                            value={item.id}
                            label={item.value}
                            style={styles.item}/>
                        ))
                    }
                </PickerIOS>
                </View>
            );
        } else {
            return;
        }
  },
  _setGenderModalVisible: function(visible) {
    this.setState({genderModalVisible: visible});
  },

  toggleDate: function () {
        //console.log("Toggling");
        this.setState({
            isAgeVisible: !this.state.isAgeVisible,isGenderOptionsVisible:false
        });
  },

  _renderDatePicker: function(){
    
    if(this.state.isAgeVisible){
      return(
      <View style={styles.restContainer}>
        <DatePickerIOS
          date={this.state.date}
          mode="date"
          onDateChange={this.onDateChange}/>
      </View>
      );
    }
    else{
      return;
    }
  },

  onTextEditingEnd:function(){
   this.refs.myScrollView.scrollTo(-0);
  },
  
  _scrollToInput :function(){
   this.refs.myScrollView.scrollTo(150);
  },

  render: function() {
      // console.log("Render");
    return (
      
      <ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        scrollable={false}>
      <View>
            <View style={styles.container}>
             <View style={styles.inputcontainer}>
                <Text style={styles.btnText}>Gender :</Text>
                <TouchableHighlight
                  style={styles.btn}
                  onPress={() => this.toggleGender()}
                  underlayColor='#dddddd'>
                  <Text style={styles.labelText}>{genderArray[this.state.currentGender]}</Text>
                </TouchableHighlight>
            </View>
            
            <View style={styles.inputcontainer}>
                <Text style={styles.btnText}>Height :</Text>
                <TextInput
            placeholder="     Height(cms)"
            returnKeyType='next'
            keyboardType='numeric'
            onChange={(event) => this.setState({height: event.nativeEvent.text})}
            style={styles.formInput}/>
            </View>
            
            <View style={styles.inputcontainer}>
                <Text style={styles.btnText}>Weight :</Text>
                <TextInput
            placeholder="     Weight(lbs)"
            keyboardType='numeric'
            onChange={(event) => this.setState({weight: event.nativeEvent.text})}
            style={styles.formInput}
            />
            </View>

            <View style={styles.inputcontainer}>
                <Text style={styles.btnText}>DOB :</Text>
                <TouchableHighlight
                  style={styles.btn}
                  onPress={() => this.toggleDate()}
                  underlayColor='#dddddd'>
                  <Text style={styles.labelText}>{this.state.date.toLocaleDateString()}</Text>
                </TouchableHighlight>
            </View>
      
            <TouchableHighlight onPress={(this.onSubmitPressed)} underlayColor="#EEEEEE" style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
            </TouchableHighlight>
             <Text style={styles.instructionFont}>Please enable location services in-order to use the app.</Text>
             </View>
             {this._renderGenderOptions()}
             {this._renderDatePicker()}
            
      </View>
      </ScrollView>
      
      );
  },
});

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: "stretch",
    justifyContent: 'center',
  },
  rowContainer :{

  },
  restContainer:{
    //flex:1,
    //marginRight: 5,
    //padding:30,
    //flexDirection: "column",
    alignItems:'center',
    //justifyContent: 'center',
    //backgroundColor: '#fff',
  },
  pickerStyle:{
    width:320,
  },
  scrollView: {
    //backgroundColor: '#6A85B1',
    height: 300,

  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  labelInput: {
    height: 40,
    //padding: 10,
    //marginRight: 5,
    //marginBottom: 5,
    marginTop: 15,
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
    //height: 180,
  },
  picker:{
    height : 15,
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
  inputcontainer: {
    marginTop: 5,
    padding: 3,
    flexDirection: 'row'
  },
  btn:{
    flex : 2,
    height: 40,
    //padding: 10,
    //marginRight: 5,
    //marginBottom: 5,
    //marginTop: 5,
    //fontSize: 20,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    //color: "#555555",
    justifyContent:"center",
    //alignSelf:"center"
  },
  btnText:{
    flex: 1,
    height: 40,
    padding: 10,
    //marginRight: 5,
    //marginBottom: 5,
    //marginTop: 5,
    fontSize: 18,
    color: "#555555",
  },
  labelText:{
    height: 40,
    //justifyContent:"center",
    alignSelf:"center",
    fontSize: 15,
    color: "#555555",
    //marginRight: 5,
    //marginBottom: 5,
    marginTop: 10,
    //borderWidth: 1,
    //borderColor: "#555555",
    //borderRadius: 8,
    flex:2,
  },
  formInput: {
    height: 40,
    //padding: 10,
    //marginRight: 15,
    //marginBottom: 5,
    //marginTop: 5,
    flex: 2,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555",
    //alignItems:'center',
    alignSelf:'center',
    justifyContent:'center',
  },

});

module.exports = UserStats;
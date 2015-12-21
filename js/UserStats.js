'use strict';

var React = require('react-native');
var Orientation = require('react-native-orientation');
var Geolocation = require('./Geolocation');
var PreWorkout = require('./PreWorkout');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');


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

    //Orientation.addOrientationListener(this._orientationDidChange);
    Orientation.lockToPortrait(); 
    
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
      deviceWidth : '',
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
  

  // callPickerStyle: function(){
  //   console.log(Orientation);
  //   Orientation.getOrientation((err,orientation)=> {
  //       console.log("Current Device Orientation: ", orientation);
  //   if(orientation == 'LANDSCAPE')
  //       {
  //         return{
  //           //flex:1,
  //           alignItems:'stretch',
  //           width:height,
  //           borderWidth:1,
  //           borderColor:'#F1F1F1',
  //           backgroundColor:'#F1F1F1',
  //         }
  //       }
  //   else
  //       {
  //         return{
  //           //flex:1,
  //           alignItems:'stretch',
  //           width:width,
  //           borderWidth:1,
  //           borderColor:'#F1F1F1',
  //           backgroundColor:'#F1F1F1',
  //         }
  //       }
  //   });
  // },

  _renderGenderOptions: function(){
    //console.log("calledAgain Gender"+this.state.isGenderOptionsVisible);
    //console.log(this.refs.sampleView.measure(sampleMeasurement()))


  
    if (this.state.isGenderOptionsVisible) {
            console.log("Gender options...");
            return (
                  <View style={styles.genderPickerStyle}>
                  <View>
                    <TouchableHighlight onPress={() => this.setState({isGenderOptionsVisible:false})} style={styles.pickerDoneStyle}>
                      <Text style={styles.doneText}>Done</Text>
                    </TouchableHighlight>
                  </View>
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
      <View style={styles.genderPickerStyle}>
          <View>
              <TouchableHighlight onPress={() => this.setState({isAgeVisible:false})} style={styles.pickerDoneStyle} underlayColor='#585858'>
                  <Text style={styles.doneText}>Done</Text>
              </TouchableHighlight>
          </View>
      <View style={styles.restContainer}>
        <DatePickerIOS
          date={this.state.date}
          mode="date"
          onDateChange={this.onDateChange}/>
      </View>
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
       console.log("Width-->"+width);
    return (
      
      <ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        //scrollable={false}
        keyboardShouldPersistTaps={false} >
      <View ref="sampleView">
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
                ref="heightInput"
              placeholder="Height(cms)"
              returnKeyType='next'
              keyboardType='numeric'
              onChange={(event) => this.setState({height: event.nativeEvent.text})}
              onFocus={()=>{this.refs.heightInput.focus();this.setState({isAgeVisible:false,isGenderOptionsVisible:false})}}
              style={styles.formInput}/>
              </View>
           
              <View style={styles.inputcontainer}>
                  <Text style={styles.btnText}>Weight :</Text>
                  <TextInput
                  ref="weightInput"
              placeholder="Weight(lbs)"
              keyboardType='numeric'
              onChange={(event) => this.setState({weight: event.nativeEvent.text})}
              onFocus={()=>{this.refs.weightInput.focus(); this.setState({isAgeVisible:false,isGenderOptionsVisible:false})}}
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
            <View style={styles.restContainer} removeClippedSubviews={true}>
             {this._renderGenderOptions()}
             {this._renderDatePicker()}
            </View>
            
      </View>
      </ScrollView>
      
      );
  },
});

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 65,
    //alignItems: "stretch",
    //justifyContent: 'center',
  },
  rowContainer :{

  },
  restContainer:{
    //flex:1,
    //marginRight: 5,
    //padding:30,
    //flexDirection: "column",
    alignItems:'center',
    //justifyContent: 'flex-end',
    //backgroundColor: '#fff',
  },
  // pickerStyle:{
  //   width:414,
  // },
  genderPickerStyle:{
    //flex:1,
    alignItems:'stretch',
    //Orientation.getOrientation((err,orientation)=> {
      // if(orientation == 'LANDSCAPE')
      // {
      //   width:width,    
      // }
      // else{
      //   width:height,
      // }
    width:width,
    marginRight:0,
    marginLeft:0,
    borderWidth:1,
    borderColor:'#F1F1F1',
    backgroundColor:'#F1F1F1',
    //justifyContent:'flex-end',
    //alignSelf:'flex-end',
  },
  pickerDoneStyle:{
    height: 30,
    alignSelf:'flex-end',
    marginTop:5,
    marginRight:10,
  },
  doneText:{
    fontSize: 15,
    fontWeight: 'bold',
  },
  View: {
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
    fontSize: 15,
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
    flexDirection: 'row',
    alignItems:'stretch'
  },
  btn:{
    flex : 2,
    height: 40,
    padding: 10,
    //marginRight: 5,
    //marginBottom: 5,
    //marginTop: 5,
    //fontSize: 20,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    //color: "#555555",
    //justifyContent:"center",
    //alignSelf:"center"
  },
  btnText:{
    flex: 1,
    height: 40,
    padding: 10,
    //marginRight: 5,
    //marginBottom: 5,
    //marginTop: 5,
    fontSize: 15,
    color: "#555555",
  },
  labelText:{
    //height: 40,
    //justifyContent:"center",
    //alignSelf:"center",
    fontSize: 15,
    //color: "#555555",
    //marginRight: 5,
    //marginBottom: 5,
    //marginTop: 10,
    //borderWidth: 1,
    //borderColor: "#555555",
    //borderRadius: 8,
    //flex:2,
  },
  formInput: {
    height: 40,
    padding: 10,
    //marginRight: 5,
    //marginBottom: 5,
    //marginTop: 5,
    flex: 2,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 8,
    color: "#555555",
    //alignItems:'center',
    //alignSelf:'center',
    //justifyContent:'center',
  },

});

module.exports = UserStats;
'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');

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


var TargetOptions = React.createClass({

  getInitialState: function() {
    return { 
      targetOptions :[{id:0,value:'Time'},{id:1,value:'Distance'},{id:2,value:'Calories'}],
      currentOption : 0,

    };
  },

  componentDidMount: function(){
    AsyncStorage.getItem("targetWorkoutOption").then((value) => {
      this.setState({"targetWorkoutOption": value});
    }).done();
  },

  _optionChanged: function(option){
    console.log("Target changed"+option);
    this.setState({currentOption: option});
    //this.saveData("targetWorkoutOption",targetOptions.option);
    if(option==0){
      this.saveData("targetWorkoutOption","Time");
      
    }
    else if(option==1){
      this.saveData("targetWorkoutOption","Distance");
    }
    else{
      this.saveData("targetWorkoutOption","Calories");
    }
    

  },

  _caloriesView : function(){
    return(
        <View style={styles.container}>
          <Text>Calories</Text>
        </View>
      );
  },

  saveData: function(key,value) {
    console.log(key+"storing"+value);
    AsyncStorage.setItem(key, value);
    this.setState({key : value});
  },

  onSetPressed: function(){
    this.props.navigator.popToTop();
  },

  render : function(){
    return(
    <View>
    <View style={styles.container}>
      <PickerIOS
      selectedValue={this.state.currentOption}
      onValueChange={this._optionChanged}
      style={styles.pickerStyle}>
      {
        this.state.targetOptions.map((item)=> (
            <PickerIOS
              key={'_'+item.id}
              value={item.id}
              label={item.value}
              style={styles.item}/>
          ))
      }
      </PickerIOS>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableHighlight onPress={(this.onSetPressed)} underlayColor="#EEEEEE" style={styles.button}>
            <Text style={styles.buttonText}>Set</Text>
            </TouchableHighlight>
      </View>
    </View>
    );
}

});

var styles = StyleSheet.create({
  container: {
    //padding: 30,
    marginTop: 5,
    alignItems: "center",
    justifyContent: 'center',
  },
  buttonContainer:{
    alignItems:"stretch",
    padding:30
  },
  pickerStyle:{
    width:width,
    //width:height,
  },
  subContainer:{
    flex :1,
    marginTop : 60,
    //alignItems: "stretch"
  },
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  button: {
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center",
    height: 36,
    flex: 1,
    backgroundColor: "#FCB130",
    borderColor: "#555555",
    //alignItems:"stretch",
  },
  buttonText: {
    fontSize: 18,
    fontWeight:"500",
    color: "#ffffff",
    alignSelf: "center"
  },
  item:{
    flex : 1,
    height: 100,
  },
  picker:{
    flex:1,
    height : 36,
  }
});





module.exports = TargetOptions;
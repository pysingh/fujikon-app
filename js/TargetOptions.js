'use strict';

var React = require('react-native');

var {  
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableHighlights,
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

  render : function(){
    return(
    <View>
    <View style={styles.container}>
      <PickerIOS
      selectedValue={this.state.currentOption}
      onValueChange={this._optionChanged}>
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

    </View>
    );
}

});

var styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 5,
    alignItems: "stretch"
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
    height: 100,
  },
  picker:{
    flex:1,
    height : 36,
  }
});





module.exports = TargetOptions;
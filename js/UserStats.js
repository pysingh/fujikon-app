'use strict';

var React = require('react-native');
var {  
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
} = React;

var UserStats = React.createClass({

	componentDidMount: function() {
        AsyncStorage.getItem("name").then((value) => {
            this.setState({"name": value});
        }).done();

        AsyncStorage.getItem("sex").then((value) => {
            this.setState({"sex": value});
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
        return { };
    },

    saveData: function(key,value) {
        AsyncStorage.setItem(key, value);
        this.setState({key : value});
    },

	render: function() {
    return (
      <View>
        <View style={styles.row}>
          <Text>
            {'Name'}
          </Text>
          <TextInput
            style={styles.textInput}
            selectTextOnFocus={true}
            onChangeText={(text) => this.saveData("name",text)}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Sex'}
          </Text>
          <TextInput
            style={styles.textInput}
            selectTextOnFocus={true}
            onChangeText={(text) => this.saveData("sex",text)}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Age'}
          </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.saveData("age",text)}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Height'}
          </Text>
          <TextInput
            style={styles.textInput}
            selectTextOnFocus={true}
            onChangeText={(text) => this.saveData("height",text)}
          />
        </View>
        <View style={styles.row}>
          <Text>
            {'Weight'}
          </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.saveData("weight",text)}
            selectTextOnFocus={true}
          />
        </View>
        <View style={styles.changeButton}>
          <Text onPress={this._change}>
            {'Submit'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>
            {'Name'}
          </Text>
          <Text style={styles.row}>{this.state.name}{this.state.sex}{this.state.age}{this.state.height}{this.state.weight}</Text>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    width: 150,
    height: 20,
    borderWidth: 0.5,
    borderColor: '#aaaaaa',
    fontSize: 13,
    padding: 4,
  },
  changeButton: {
    alignSelf: 'center',
    marginTop: 5,
    padding: 3,
    borderWidth: 0.5,
    borderColor: '#777777',
  },
});

module.exports = UserStats;
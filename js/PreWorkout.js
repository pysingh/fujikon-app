'use strict';

var React = require('react-native');
var { SMBLEManager } = require('NativeModules');
var BLEConnectionModule = require('react-native').NativeModules.BLEConnectionModule;
var Modal   = require('react-native-modalbox');

var ActivityOptions = require('./ActivityOptionListView');
var WorkoutOptions = require('./WorkoutOptionsListView');

var Workout = require('./Workout');

var count = 0;
var listOptions = ['Activity','Workout'];
var activityName = "Running";
var workoutName = "Just Track Me";
var subTitle=[activityName,workoutName];
var deviceList = [];
var started = 0;
var ProgressBar = require('ProgressBarAndroid');
var Subscribable = require('Subscribable');
/*import { DeviceEventEmitter } from 'react-native';*/



// var connectionState = "Not connected";


var {
  Image,
  ListView,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage,
  Text,
  Image,
  Navigator,
  View,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Platform,
  TouchableOpacity,
  ActivityIndicatorIOS,
} = React;
  

var platform = Platform.OS;
var subscriptionBLE;
var androidDeviceList = new Set();
var ListViewSimpleExample = React.createClass({
  
  statics: {
    title: '<ListView> - Simple',
    description: 'Performant, scrollable list of data.'
  },
  
  getInitialState: function() {
    //console.log("Initialization..");
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      //dataSource: new ListView.DataSource({
      //rowHasChanged: (row1, row2) => row1 !== row2,
      //}),
      dataSource: ds.cloneWithRows(this.genRows({})),
      //dataSource: ds.cloneWithRows(this.genRows(deviceList)),
      //dataSourceForActivity: ds.cloneWithRows(['row1','row2','row3']),
      selectedActivity:"Running",
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      connectionState : 'Not connected',
      
    };


  },

  genRows: function(){
    console.log("Device list retrieving in rows : ",deviceList);
    var deviceArray = [];
    for (var ii = 0; ii <=100; ii++) {
      
      if(deviceList[ii])
      {
        var deviceName = deviceList[ii] ? deviceList[ii] : null;
      //console.log("Device name "+deviceList[ii]);
        deviceArray.push(deviceName);  
      }
    } 
    console.log("Device array from list view :",deviceArray);
    return deviceArray;
  },

  refreshActivityData: function(data) {
    this.setState({selectedActivity:data});

  },
  refreshWorkoutData: function(data) {
  // console.log(this.state);
  this.setState({selectedWorkout:data});
},


   //console.log("Did Mounting...");
  // AsyncStorage.getItem("connectionStatus").then((value) => {
  //     //console.log("Async value "+value);
  //     this.setState({"connectionStatus":connectionState});
  //   }).done();
  mixins: [Subscribable.Mixin],
componentWillMount:function(){
   this.addListenerOn(DeviceEventEmitter,
                       'device_params',
                       this.onDeviceFoundAndroid);
   this.addListenerOn(DeviceEventEmitter,
                       'connection_status_change',
                       this.onConnectionStatusChange);
   this.addListenerOn(DeviceEventEmitter,
                       'device_connection_status_change',
                       this.onDeviceConnectionStatusChange);
  AsyncStorage.getItem("selectedActivity").then((value) => {
      //console.log("Async value "+value);
      activityName = value;
      this.setState({"selectedActivity": value});
    }).done();
  AsyncStorage.getItem("selectedWorkout").then((value) => {
      //console.log("Async value "+value);
      workoutName=value;
      this.setState({"selectedWorkout": value});
    }).done();
  
  //activityName = this.state.selectedActivity;
  subscriptionBLE = NativeAppEventEmitter.addListener("connectionStatus", (data) => {
    
    console.log("Connection status has been changed...");
    this.setState({connectionState:data.status});
    // AsyncStorage.setItem("connectionStatus", data.status);
  });
},
onDeviceConnectionStatusChange:function(msg: Event) {
    this.setState({connectionState:msg});
  },
onConnectionStatusChange:function(e: Event) {
   // this.setState({connectionState:data.status});
  },

 onDeviceFoundAndroid:function(e: Event) {
   /* this.keyboardWillOpenTo = e;
    this.props.onKeyboardWillShow && this.props.onKeyboardWillShow(e);*/
    var myDevice = JSON.parse(e);
    androidDeviceList.add(myDevice.name);
    deviceList = []
      androidDeviceList.forEach(value => deviceList.push(value));
    // for(var key in androidDeviceList){deviceList.push(androidDeviceList[key])}
    console.log(deviceList)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({dataSource: ds.cloneWithRows(this.genRows())});
    // this.deviceList = deviceList;
    //console.log(deviceList)
  },
getOptions: function(){

    //activityName = this.state.selectedActivity;
    //console.log("Get Options called.."+activityName);
    return (

      <TouchableHighlight onPress={(this.onTabPressed.bind(this,count))} underlayColor="#EEEEEE">
      <View style={styles.container}>
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{listOptions[count++]}</Text>
      <Text style={styles.year}>{this.state.intialValue}</Text>
      <View style={styles.separator} />
      </View>
      </View>
      
      </TouchableHighlight>

      );
    count++;
  },

  onStartPressed: function(){
    // var Workout = require('./Workout');
    // SMBLEManager.initParameters("180D","2A37");
    
if(platform == 'ios'){
    this.props.navigator.replace({
      component: Workout,
      //passProps:{connectionStatus : this.state.connectionState},
      componentConfig : {
        title : "My New Title"
      },
    });  
  }else{
/*BLEConnectionModule.discoverServices((status) => {
          // onServicesDiscovered

          
      },(onServicesDiscovered) => {
          // onDataAvailable
          
          
      });*/
    this.props.navigator.push({
      id: 'WorkoutPage',
      BLEConnectionModule:BLEConnectionModule
    });
       
  }

  },

  onConnectPressed: function(){

    var Workout = require('./Workout');

    if(platform === 'ios'){
      if(started != 1)
        {
          SMBLEManager.initParameters("180D","2A37");  
          started = 1;
        }
      subscriptionBLE = NativeAppEventEmitter.addListener("availableDeviceList", (data) => {
      console.log("Available device list from React : ",data.devices);
      deviceList = data.devices;
      console.log("Device list "+deviceList);
            

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({dataSource: ds.cloneWithRows(this.genRows({}))});

         
      }); 
    }else{
          deviceList = [];
          var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
          this.setState({dataSource: ds.cloneWithRows(this.genRows())});
          BLEConnectionModule.startScan();
    }
          
    this.openModal3();

    // this.props.navigator.replace({
    //   component: Workout,
    //   componentConfig : {
    //     title : "My New Title"
    //   },
    // });  

  },

  onTabPressed: function(rowID){
    /*console.log("Tab pressed...."+rowID);*/
    if(platform == 'ios'){
      if(rowID==0)
      {
        this.props.navigator.push({
          component: ActivityOptions,
          backButtonTitle: 'Back',
          passProps : {obj: this},
          componentConfig : {
            title : "My New Title"
          },
        });
      }
      else
      {
        this.props.navigator.push({
          component: WorkoutOptions,
          backButtonTitle: 'Back',
          passProps : {obj: this}, 
          componentConfig : {
            title : "My New Title"
          },
        });
      }
    }else{
      if(rowID==0)
      {
        this.props.navigator.push({
        id: 'ActivityOptionListView',
        name: 'workout',  
        passProps : {obj: this} 
        });
      }else{
        this.props.navigator.push({
        id: 'WorkoutOptionsListView',
        name: 'Activity',
        passProps: {obj: this.refreshWorkoutData}     
        });
      }
    }
  },


renderSeparator: function(sectionID, rowID, adjacentRowHighlighted) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    // return (
    //   <View key={"SEP_" + sectionID + "_" + rowID}  style={style}/>
    // );
    return(
        <View style={styles.rowSeparator}>

        </View>
      );
  },

  openModal3: function(id) {
    // console.log('this.refs ', this.myTextInput);

    // this.refs.modal3.open();
    this.myTextInput.open();
  },

  closeModal5: function(id) {
    // this.setState({isOpen: false});
    this.refs.modal3.close();
  },

  onDeviceTabPressed: function(rowID) {
    console.log("Row Pressed" , rowID)
    if(platform == 'ios'){
      SMBLEManager.connectDevice(deviceList[rowID],rowID);
    }
    else{
      //stopping device scan  
      BLEConnectionModule.stopScan();  
      // android native connect method with connect_success and error callbacks.
      BLEConnectionModule.connect(deviceList[rowID]);
    }
   this.closeModal5();

  },


  renderRow: function(rowData: string, sectionID: number, rowID: number){
    console.log("Rendering row with : "+ rowID);
    return(
        <TouchableHighlight onPress={this.onDeviceTabPressed.bind(this,rowID)} underlayColor="#EEEEEE">
          <View style={styles.modalList}>
            <Text style={styles.deviceTab}>{deviceList[rowID]}</Text>
          </View>
        </TouchableHighlight>
      );
  },

  renderFooter: function() {
    if(Platform.os == 'ios'){
      return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
    }
      else{
    return ;
      }
  },
  render: function() {
    if(count!=0)
      count=0;
    // if(this.props.connectionStatus)
    //   this.state.connectionState = this.props.connectionStatus;
    if(Platform.OS == 'ios'){
      return (
       this.renderScene()
      );
    }else{
      return(
      <Navigator
          ref = "NavBar"
          renderScene={this.renderScene.bind(this)}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#FCB130', alignItems: 'center'}}
                routeMapper={NavigationBarRouteMapper} />
          } />);
    }
},
renderScene: function(route, navigator) {

  return(
    <View style ={styles.screenContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Bluetooth Connection</Text>
          </View>

          <View style={styles.connectionContainer}>
            <Text style={styles.statusTitle}>Status : {this.state.connectionState} </Text>
          </View>

          <View style={styles.connectionButtonContainer}>
             <TouchableHighlight onPress={this.onConnectPressed.bind(this)} underlayColor="#EEEEEE" style={styles.connectButton}>  
             <Text style={styles.connectButtonText}>Connect</Text>
             </TouchableHighlight> 
          </View>

          <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Choose From</Text>
          </View>
          <View style = {styles.container}>
              <TouchableHighlight onPress={(this.onTabPressed.bind(this,count))} underlayColor="#EEEEEE">
                <View style={styles.container}>
                  <View style={styles.rightContainer}>
                  <Text style={styles.title}>{listOptions[count++]}</Text>
                  <Text style={styles.year}>{this.state.selectedActivity}</Text>
                  </View>
                  <View style={styles.separator} />
                </View>
              </TouchableHighlight>
          <TouchableHighlight onPress={(this.onTabPressed.bind(this,count))} underlayColor="#EEEEEE">
            <View style={styles.container}>
              <View style={styles.rightContainer}>
              <Text style={styles.title}>{listOptions[count++]}</Text>
              <Text style={styles.year}>{this.state.selectedWorkout}</Text>
              <View style={styles.separator} />
              </View>
            </View>
          </TouchableHighlight>             
        </View>
        
      <View style={styles.bottomContainer}>
      <TouchableHighlight onPress={(this.onStartPressed)} underlayColor="#EEEEEE" style={styles.button}>
      <Text style={styles.buttonText}>Start</Text>
      </TouchableHighlight>
      </View>

      <Modal ref={(ref) => this.myTextInput = ref} style={[styles.modal, styles.modal3]} position={"center"} >
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Available Devices :</Text>
          </View>
          <ListView
        //ref="listview"
         //renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
       renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        // onEndReached={this.onEndReached}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}/>
        </Modal>
      </View>
  );
}

});
var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
       return (
        <Image
          source={{uri: 'http://facebook.github.io/react/img/logo_og.png'}}
          style={styles.base}/>
      );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Pre Workout
        </Text>
      </TouchableOpacity>
    );
  }
};

var styles = StyleSheet.create({
  listView: {
    paddingTop: 30,
        //backgroundColor: '#F5FCFF',
        height:200,
      },
      base: {
width: 35,
height: 35,
      },
      screenContainer:{
        paddingTop:50,
        flex:1,
      },
      container: {
        //flex: 1,
        //flexDirection: 'row',
        marginTop:10,
        alignItems: 'stretch',
        justifyContent: 'center',        //backgroundColor: '#F5FCFF',
      },
      rightContainer: {
        //flex: 1,
        height: 70,
        alignItems : 'center',
        justifyContent: 'center',
      },
      bottomContainer:{
        //flex:1,
        justifyContent: 'flex-end',
        marginBottom:100,
      },
      modalList:{
        justifyContent:'center',
        height:50,
      },
      title: {
        fontSize: 20,
        marginBottom: 6,
        textAlign: 'center',
      },
      deviceTab:{
        textAlign:'center',
        fontSize:18,
      },
      year: {
        textAlign: 'center',
      },
      statusTitle: {
        fontSize: 15,
        marginBottom: 6,
        textAlign: 'center',
      },
      button: {
        height: 40,
        //flex: 1,
        backgroundColor: "#FCB130",
        borderColor: "#555555",
    //borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        marginRight: 15,
        marginLeft: 15,
        justifyContent: "center",
      },
      titleContainer :{
        height:40,
        alignSelf:'stretch',
        alignItems:'flex-start',
        backgroundColor:'#F1F1F1',
        marginTop:10,
      },
      buttonText: {
        fontSize: 18,
        color: "#ffffff",
        alignSelf: "center"
      },
      separator: {
        height: 1,
        backgroundColor:"#7C7C7C",
        marginRight:50,
        marginLeft:50,
        //alignSelf :'flex-end',
      },
      lineSeperator : {
        height:1,
        flex:1,
        backgroundColor:'black',
      },
      connectionContainer: {
            //flex: 1,
            //flexDirection: 'row',
            marginLeft:15,
            marginTop:10,
            alignItems: 'flex-start',
            //justifyContent: 'center',        //backgroundColor: '#F5FCFF',
          },
      connectButtonText: {
        fontSize: 15,
        color: "#ffffff",
        alignSelf: "center",

      },
      connectButton: {
            height: 34,
            //flex: 1,
            backgroundColor: "#FCB130",
            borderColor: "#555555",
        //borderWidth: 1,
        borderRadius: 8,
         marginRight: 15,
         marginBottom:15,
         marginLeft: 15,
        width:100,
        justifyContent: "center",
      },
      connectionButtonContainer:{
        //flex: 1,
        justifyContent:"flex-end",
        alignItems:"flex-end",
      },
      titleText:{
        fontSize:18,
        marginRight:15,
        // marginBottom:5,
        marginLeft: 15,
        marginTop:10,
      },
       modal: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      modal3: {
        height: 300,
        width: 300,
      },
      rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 1,
        marginHorizontal: 10,
      },
      rowSeparatorHide: {
        opacity: 0.0,
      },
      scrollSpinner:{
        alignSelf:'center',
      },

});
module.exports = ListViewSimpleExample;
var React = require('react-native');
var RNChart = require('react-native-chart-nosensezzz');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var dynamicGraphWidth=0;
var dynamicContainerWidth=0;
var isArrayZero=0;
var yAxisData = [];

var {
    StyleSheet, View, Component,Text,
} = React;




//var xLabels = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];

//var chartData = [
    // {
    //     name:'BarChart',
    //     type:'bar',
    //     widthPercent:0.6,
    //     data:[
    //         30, 1, 1, 2, 3, 5, 21, 13, 21, 34, 55, 30, 23, 54, 76, 21, 32
    //     ]
    // },
    
//];

class SimpleChart extends Component {
    

    applyMultiplyingFactor(){
        noOfPoints = (this.props.xData).length;
        if(noOfPoints < 10)
        {
            dynamicGraphWidth=400;
            dynamicContainerWidth=600;
            console.log("Under 10 -->"+dynamicGraphWidth+"-->"+dynamicContainerWidth);
        }   
        else
        {
            dynamicGraphWidth= width*(noOfPoints/10);
            dynamicContainerWidth = dynamicGraphWidth+200;
            console.log("Above 50 -->"+dynamicGraphWidth+"-->"+dynamicContainerWidth);    
        }

    }

    chartStyle(){
        return{
            position: 'absolute', 
            width: dynamicGraphWidth, 
            height: 200, 
            left: 0,
            flex:1,
            marginTop: 10,
        }
    }

    containerStyle(){
        return{
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            width:dynamicContainerWidth,
            marginTop : 10,
        }
    }


    render() {
        xAxisArray : this.props.xData;
        yAxisArray : this.props.yData;
        yAxisData = this.props.yData;
        

        this.applyMultiplyingFactor();
        for (i = 0; i < (this.props.yData).length; i++) { 
                if(yAxisData[i]!= 0){
                    isArrayZero=1;
                }
        }

         if((this.props.xData).length <= 3 || isArrayZero==0)
        return(
           <View style={styles.instructionContainer}>
                <Text style={styles.note}>No Data to show.</Text>
            </View >
        );
        
        return (
            <View style={this.containerStyle()}>
            <RNChart style={this.chartStyle()}
            chartData={[{
                name:'LineChart',
                lineWidth:2,
                showDataPoint:false,
                //data: [30, 1, 1, 2, 3, 5, 21, 13, 21, 34, 55, 30, 23, 54, 76, 21, 32]
                data : this.props.yData
            }]}
            // verticalGridStep="3"
            xAxisTitle={this.props.xAxisName}
            yAxisTitle={this.props.yAxisName}
            labelFontSize={15}
            xLabels={this.props.xData}>
            </RNChart>
            </View>
            );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center',width:dynamicContainerWidth,
    },
    chart: {
        // position: 'absolute', top: 100, left: 16, bottom: 100,right: 100
        position: 'absolute', 
        //top: 80, 
        width: dynamicGraphWidth, 
        height: 200, 
        left: 0,
        flex:1,
        //right: dynamicGraphWidth,
        //marginRight: 30,
        //marginBottom: 20,
        marginTop: 10,
        //marginLeft: 5,
    },
    note:{
        //alignSelf:'center',
        //marginLeft:20,
        //marginRight:20,
        alignItems:'center',
    },
    instructionContainer:{
        alignItems:'center',
        //justifyContent:'center',
        padding: 150,
        //padding: 50,
        //alignItems: "stretch",
    },
});

module.exports = SimpleChart;
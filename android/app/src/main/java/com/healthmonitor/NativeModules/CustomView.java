package com.healthmonitor.NativeModules;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.github.mikephil.charting.animation.Easing;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.github.mikephil.charting.utils.Utils;

import com.github.mikephil.charting.data.Entry;
import com.google.gson.Gson;
import com.healthmonitor.DeviceDetailModel;
import com.healthmonitor.R;
import com.healthmonitor.Utils.Constants;
import com.healthmonitor.Utils.GraphdataModel;

import java.util.ArrayList;

/**
 * Created by dmota on 06/04/16.
 */
public class CustomView extends SimpleViewManager<LineChart> {
    public static final String REACT_CLASS = "CustomView";
    private ThemedReactContext ctx;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected LineChart createViewInstance(ThemedReactContext context) {
        ctx = context;
        return new LineChart(context);
    }

    @ReactProp(name = "source")
    public void setSource(LineChart mChart, String source) {
        Gson gson = new Gson();
        GraphdataModel graphdataModel = gson.fromJson(source,GraphdataModel.class);
        try {
            Log.e("chart", source);
            //mChart.setBackground(ctx.getResources().getDrawable(R.drawable.ic_launcher));
            mChart.setDrawGridBackground(false);

            // no description text
            mChart.setDescription("");
            mChart.setNoDataTextDescription("No data available");

            // enable touch gestures
            mChart.setTouchEnabled(true);

            // enable scaling and dragging
            mChart.setDragEnabled(true);
            mChart.setScaleEnabled(true);
            // mChart.setScaleXEnabled(true);
            // mChart.setScaleYEnabled(true);

            // if disabled, scaling can be done on x- and y-axis separately
            mChart.setPinchZoom(true);

            // set an alternative background color
            // mChart.setBackgroundColor(Color.GRAY);

            // create a custom MarkerView (extend MarkerView) and specify the layout
            // to use for it

            // set the marker to the chart

            // x-axis limit line
            LimitLine llXAxis = new LimitLine(10f, "Index 10");
            llXAxis.setLineWidth(4f);
            llXAxis.enableDashedLine(10f, 10f, 0f);
            llXAxis.setLabelPosition(LimitLine.LimitLabelPosition.RIGHT_BOTTOM);
            llXAxis.setTextSize(10f);

            XAxis xAxis = mChart.getXAxis();
            //xAxis.setValueFormatter(new MyCustomXAxisValueFormatter());
            //xAxis.addLimitLine(llXAxis); // add x-axis limit line


            LimitLine ll1 = new LimitLine(130f, "Upper Limit");
            ll1.setLineWidth(4f);
            ll1.enableDashedLine(10f, 10f, 0f);
            ll1.setLabelPosition(LimitLine.LimitLabelPosition.RIGHT_TOP);
            ll1.setTextSize(10f);

            LimitLine ll2 = new LimitLine(-30f, "Lower Limit");
            ll2.setLineWidth(4f);
            ll2.enableDashedLine(10f, 10f, 0f);
            ll2.setLabelPosition(LimitLine.LimitLabelPosition.RIGHT_BOTTOM);
            ll2.setTextSize(10f);

            YAxis leftAxis = mChart.getAxisLeft();
            leftAxis.removeAllLimitLines(); // reset all limit lines to avoid overlapping lines
            leftAxis.addLimitLine(ll1);
            leftAxis.addLimitLine(ll2);
            leftAxis.setAxisMaxValue(100f);
            leftAxis.setAxisMinValue(0);
            //leftAxis.setYOffset(20f);
            leftAxis.enableGridDashedLine(10f, 10f, 0f);
            leftAxis.setDrawZeroLine(false);

            // limit lines are drawn behind data (and not on top)
            leftAxis.setDrawLimitLinesBehindData(true);

            mChart.getAxisRight().setEnabled(false);

            //mChart.getViewPortHandler().setMaximumScaleY(2f);
            //mChart.getViewPortHandler().setMaximumScaleX(2f);

            // add data
            if(graphdataModel != null){
                switch (graphdataModel.getGraph_type()){
                    case Constants.GRAPH_TYPE_ELEVATION:
                        setData(graphdataModel.getTimeData(),graphdataModel.getElevationData(),mChart);
                        break;
                    case Constants.GRAPH_TYPE_HEART_RATE:
                        setData(graphdataModel.getTimeData_heart(),graphdataModel.getHeartBeatData(),mChart);
                        break;
                    case Constants.GRAPH_TYPE_SPEED:
                        setData(graphdataModel.getTimeDataForSpeed(),graphdataModel.getSpeedData(),mChart);
                        break;
                }
            }

//        mChart.setVisibleXRange(20);
//        mChart.setVisibleYRange(20f, AxisDependency.LEFT);
//        mChart.centerViewTo(20, 50, AxisDependency.LEFT);

            mChart.animateX(2500, Easing.EasingOption.EaseInOutQuart);
//        mChart.invalidate();

            // get the legend (only possible after setting data)
            Legend l = mChart.getLegend();

            // modify the legend ...
            // l.setPosition(LegendPosition.LEFT_OF_CHART);
            l.setForm(Legend.LegendForm.LINE);
            /*view.setImageDrawable(ctx.getResources().getDrawable(R.drawable.ic_launcher));*/
            /*InputStream ims = ctx.getAssets().open("images/" + source);
            Drawable d = Drawable.createFromStream(ims, null);*/
            /*view.setImageDrawable(R.mipmap.ic_launcher);*/
           /* view.setBackground(null);*/
        } catch (Exception ex) {
            Log.e("KenBurnsView", "setSource", ex);
        }
    }
    private void setData(int[] xAxisCoord, int[] yAxisCoord, LineChart mChart) {

        ArrayList<String> xVals = new ArrayList<String>();
//        for (int i = 0; i < xAxisCoord.length; i++) {
//            xVals.add(xAxisCoord[i] +"");
//        }
        for(int count=0;count<yAxisCoord.length;count++){
            Log.e("y point",yAxisCoord[count]+"");
            xVals.add(yAxisCoord[count] + "");
        }

        ArrayList<Entry> yVals = new ArrayList<Entry>();

        for (int i = 0; i < yAxisCoord.length; i++) {
            /*float mult = (range + 1);
            float val = (float) (Math.random() * mult) + 3;// + (float)
            // ((mult *
            // 0.1) / 10);
            yVals.add(new Entry(val, i));*/
            yVals.add(new Entry(yAxisCoord[i], i));
        }

        // create a dataset and give it a type
        LineDataSet set1 = new LineDataSet(yVals, "time");
        // set1.setFillAlpha(110);
        // set1.setFillColor(Color.RED);

        // set the line to be drawn like this "- - - - - -"
        set1.enableDashedLine(10f, 5f, 0f);
        set1.enableDashedHighlightLine(10f, 5f, 0f);
        set1.setColor(Color.BLACK);
        set1.setCircleColor(Color.BLACK);
        set1.setLineWidth(1f);
        set1.setCircleRadius(3f);
        set1.setDrawCircleHole(false);
        set1.setValueTextSize(9f);
        set1.setDrawFilled(true);

        if(Utils.getSDKInt() >= 18) {
            // fill drawable only supported on api level 18 and above
            /*Drawable drawable = ContextCompat.getDrawable(ctx, R.drawable.ic_launcher);*/
            /*set1.setFillDrawable(drawable);*/
        } else {
            set1.setFillColor(Color.BLACK);
        }

        ArrayList<ILineDataSet> dataSets = new ArrayList<ILineDataSet>();
        dataSets.add(set1); // add the datasets

        // create a data object with the datasets
        LineData data = new LineData(xVals, dataSets);

        // set data
        mChart.setData(data);
    }
}

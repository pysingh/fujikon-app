package com.healthmonitor.NativeModules;

import android.app.Activity;
import android.telecom.Call;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.healthmonitor.Utils.Constants;
import com.healthmonitor.Utils.LocationSpeedModel;

import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.Nullable;

/**
 * Created by nkhaturia on 29/3/16.
 */
public class TimerModule extends ReactContextBaseJavaModule {
    private static final String TAG = TimerModule.class.getSimpleName();
    private Timer timer;
    private Callback timerCallBack;
    private ReactApplicationContext reactContext;
    private int seconds;
    private AndroidGeolocationModule androidGeolocationModule;
    private String jsonString;

    public TimerModule(ReactApplicationContext reactContext, Activity mActivity) {
        super(reactContext);
        this.reactContext = reactContext;
        timer = new Timer();
        androidGeolocationModule = new AndroidGeolocationModule(reactContext);
        Log.d(TAG, "timer initialised");
    }

    @ReactMethod
    public void resetTimer() {
        seconds = 0;
        if (timer != null) {
            timer.cancel();
        }
    }

    @ReactMethod
    public void startTimer() {
        jsonString = Constants.EMPTY_STRING;
        //timerCallBack = callback;
        resetTimer();
        timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                seconds++;
                if (androidGeolocationModule != null) {
                    LocationSpeedModel locationSpeedModel = androidGeolocationModule.getCurrentLocation();
                    if (locationSpeedModel != null) {
                        locationSpeedModel.setSeconds(seconds);
                        Gson gson = new Gson();
                        jsonString = gson.toJson(locationSpeedModel, LocationSpeedModel.class);
                    }
                }
                // timerCallBack.invoke(seconds);
//                Log.e("seconds native module", seconds+"");
                sendEvent(reactContext, "time", null, jsonString);


            }
        }, Constants.TIME_INTERVAL, Constants.TIME_INTERVAL);
    }

    @Override
    public String getName() {
        return "TimerModule";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params, String jsonString) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, jsonString);
    }
}

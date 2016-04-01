package com.healthmonitor.NativeModules;

import android.app.Activity;
import android.telecom.Call;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.healthmonitor.Utils.Constants;

import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by nkhaturia on 29/3/16.
 */
public class TimerModule extends ReactContextBaseJavaModule {
    private Timer timer;
    private Callback timerCallBack;
    private int seconds;

    public TimerModule(ReactApplicationContext reactContext, Activity mActivity) {
        super(reactContext);
        timer = new Timer();
    }

    @ReactMethod
    private void resetTimer() {
        if (timer != null) {
            timer.cancel();
        }
    }

    @ReactMethod
    private void startTimer(Callback callback) {
        timerCallBack = callback;
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                seconds++;
                timerCallBack.invoke(seconds);
            }
        }, Constants.TIME_INTERVAL, Constants.TIME_INTERVAL);
    }

    @Override
    public String getName() {
        return "TimerModule";
    }
}

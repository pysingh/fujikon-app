package com.healthmonitor;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewManager;
import com.healthmonitor.NativeModules.AndroidGeolocationModule;
import com.healthmonitor.NativeModules.BLEConnectionModule;
import com.healthmonitor.NativeModules.CustomView;
import com.healthmonitor.NativeModules.TimerModule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by nkhaturia on 28/3/16.
 */
public class ReactPackages implements ReactPackage {

    private Activity mActivity = null;

    public ReactPackages(Activity activity) {
        mActivity = activity;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new BLEConnectionModule(reactContext, mActivity));
        modules.add(new TimerModule(reactContext, mActivity));
        modules.add(new AndroidGeolocationModule(reactContext));
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.asList(new ViewManager[]{new CustomView()});
    }
}

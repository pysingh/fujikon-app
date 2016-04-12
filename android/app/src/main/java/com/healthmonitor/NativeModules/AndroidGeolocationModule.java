package com.healthmonitor.NativeModules;

/**
 * Created by nkhaturia on 31/3/16.
 */

import android.location.Location;
import android.os.Bundle;
import android.util.Log;


import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;
import com.healthmonitor.Utils.Constants;
import com.healthmonitor.Utils.LocationSpeedModel;

public class AndroidGeolocationModule extends ReactContextBaseJavaModule
        implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {
    protected static final String TAG = "GeoLocation";
    protected GoogleApiClient mGoogleApiClient;
    protected Location mLastLocation;

    private final static int CONNECTION_FAILURE_RESOLUTION_REQUEST = 9000;
    private LocationSpeedModel locationSpeedModel;

    @Override
    public String getName() {
        return "AndroidGeolocation";
    }

    public AndroidGeolocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        buildGoogleApiClient();
        locationSpeedModel = new LocationSpeedModel();
    }

    protected synchronized void buildGoogleApiClient() {
        mGoogleApiClient = new GoogleApiClient.Builder(getReactApplicationContext())
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
        mGoogleApiClient.connect();
    }

    public LocationSpeedModel getCurrentLocation() {
//        WritableMap location = Arguments.createMap();
//        WritableMap coords = Arguments.createMap();
//        String errorMessage = "Location could not be retrieved";
//        locationSpeedModel = new LocationSpeedModel();
        mLastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
        if (mLastLocation != null) {
//            int altitude = (int) mLastLocation.getAltitude();
//            int speed = (int) mLastLocation.getSpeed();
            locationSpeedModel.setAltitude((int) mLastLocation.getAltitude());
            locationSpeedModel.setAltitude((int) mLastLocation.getSpeed());
            /*Log.e("altitude", "" + mLastLocation.getAltitude());*/
            //success.invoke(altitude, speed);
        }
        // Else, the error callback is invoked with an error message
        //error.invoke(errorMessage);

        return locationSpeedModel;
    }

    @Override
    public void onConnected(Bundle connectionHint) {
        mLastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
    }


    @Override
    public void onConnectionFailed(ConnectionResult result) {
        // Refer to Google Play documentation for what errors can be logged
        Log.i(TAG, "Connection failed: ConnectionResult.getErrorCode() = " + result.getErrorCode());
    }

    @Override
    public void onConnectionSuspended(int cause) {
        // Attempts to reconnect if a disconnect occurs
        Log.i(TAG, "Connection suspended");
        mGoogleApiClient.connect();
    }
}
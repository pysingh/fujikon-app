package com.healthmonitor.NativeModules;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.healthmonitor.DeviceDetailModel;
import com.healthmonitor.MainActivity;
import com.healthmonitor.Receivers.BLEReceiver;
import com.healthmonitor.Utils.CommonUtilities;
import com.healthmonitor.Utils.Constants;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nullable;

/**
 * Created by nkhaturia on 28/3/16.
 */
public class BLEConnectionModule extends ReactContextBaseJavaModule {
    private static final String TAG = BLEConnectionModule.class.getSimpleName();
    private Context mContext;
    /*private Callback onScanComplete;
    private Callback onScanError;*/
    private BluetoothAdapter mBluetoothAdapter;
    private int REQUEST_ENABLE_BT = 1;
    private BLEReceiver bleReceiver;
    private boolean mScanning;
    private ArrayList<BluetoothDevice> bleArrayList;
    private BluetoothDevice findResult;
    private BluetoothGatt mBluetoothGatt;
    private Callback onDataAvailable;
    private boolean isConnected;
    private ReactApplicationContext reactContext;

    public BLEConnectionModule(ReactApplicationContext reactContext, Activity mActivity) {
        super(reactContext);
        this.reactContext = reactContext;
        mContext = mActivity;
        bleArrayList = new ArrayList<>();
        initBLE();
    }

    @ReactMethod
    public void connect(String deviceName) {
        Log.d("inside connect native", "connect: " + deviceName);
        BluetoothDevice bluetoothDevice = getDeviceFromAddress(deviceName);
        if (bluetoothDevice != null) {
            mBluetoothGatt = bluetoothDevice.connectGatt(mContext, false, bluetoothGattCallback);
        } else {
            sendEvent(reactContext, "connection_status_change", null, "Error in connection");
        }
    }
    @ReactMethod
    public void disConnect() {
        mBluetoothGatt.disconnect();
                /*mBluetoothGatt = bluetoothDevice.connectGatt(mContext, false, bluetoothGattCallback);*/
    }
    private BluetoothDevice getDeviceFromAddress(String name) {
        for (int count = 0; count < bleArrayList.size(); count++) {
            if (name.equalsIgnoreCase(bleArrayList.get(count).getName())) {
                return bleArrayList.get(count);
            }
        }
        return null;
    }

    private void initBLE() {
        bleReceiver = new BLEReceiver();
        final BluetoothManager bluetoothManager =
                (BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            ((MainActivity) mContext).startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        }
    }

    BluetoothGattCallback bluetoothGattCallback = new BluetoothGattCallback() {
        @Override
        public void onMtuChanged(BluetoothGatt gatt, int mtu, int status) {
            super.onMtuChanged(gatt, mtu, status);
        }

        @Override
        public void onReadRemoteRssi(BluetoothGatt gatt, int rssi, int status) {
            super.onReadRemoteRssi(gatt, rssi, status);
        }

        @Override
        public void onReliableWriteCompleted(BluetoothGatt gatt, int status) {
            super.onReliableWriteCompleted(gatt, status);
        }

        @Override
        public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
            super.onDescriptorWrite(gatt, descriptor, status);
        }

        @Override
        public void onDescriptorRead(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
            super.onDescriptorRead(gatt, descriptor, status);
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {

            broadcastUpdate(characteristic);
            super.onCharacteristicChanged(gatt, characteristic);
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicWrite(gatt, characteristic, status);
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            broadcastUpdate(characteristic);
            /*super.onCharacteristicRead(gatt, characteristic, status);*/
            /*if (status == BluetoothGatt.GATT_SUCCESS) {
                broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
            }*/
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            super.onServicesDiscovered(gatt, status);
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Log.e("onServicesDiscovered", "success");
                displayGattServices(getSupportedGattServices());
            } else {

            }
        }

        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            super.onConnectionStateChange(gatt, status, newState);
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                discoverServices();
                if (((MainActivity) mContext) != null) {
                    ((MainActivity) mContext).runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            CommonUtilities.showToast("Device connected and Now attempting to start service discovery:", mContext);
                            sendEvent(reactContext, "device_connection_status_change", null, "device_connected");
                        }
                    });

                }
                isConnected = true;
                /*onDeviceConnected.invoke("Connected");*/
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                if (((MainActivity) mContext) != null) {
                    ((MainActivity) mContext).runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            CommonUtilities.showToast("Device disconnected ", mContext);
                            sendEvent(reactContext, "device_connection_status_change", null, "device_disconnected");
                        }
                    });
                }
                isConnected = false;
                sendEvent(reactContext, "connection_status_change", null, "Not Connected");
                /*onDeviceConnectionError.invoke("Not Connected");*/

            }
        }
    };

    private void broadcastUpdate(final BluetoothGattCharacteristic characteristic) {
        int flag = characteristic.getProperties();
        int format = -1;
        if ((flag & 0x01) != 0) {
            format = BluetoothGattCharacteristic.FORMAT_UINT16;
            Log.d(TAG, "Heart rate format UINT16.");
        } else {
            format = BluetoothGattCharacteristic.FORMAT_UINT8;
            Log.d(TAG, "Heart rate format UINT8.");
        }
        final int heartRate = characteristic.getIntValue(format, 1);
        Log.d(TAG, "" + heartRate);
        sendEvent(reactContext, "heart_rate", null, Integer.toString(heartRate));
    }

    /*@ReactMethod
    public void showToast() {
        Toast.makeText(mContext, "msg msg", Toast.LENGTH_LONG).show();
    }*/

    private void displayGattServices(List<BluetoothGattService> gattServices) {
        if (gattServices == null)
            return;
        if (gattServices.size() > 0) {
            BluetoothGattCharacteristic bluetoothGattCharacteristic = null;
            bluetoothGattCharacteristic = gattServices.get(3).getCharacteristics().get(0);
            if (bluetoothGattCharacteristic != null) {
                mBluetoothGatt.setCharacteristicNotification(bluetoothGattCharacteristic, true);
                BluetoothGattDescriptor bluetoothGattDescriptor = bluetoothGattCharacteristic.getDescriptors().get(0);
                bluetoothGattDescriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                mBluetoothGatt.writeDescriptor(bluetoothGattDescriptor);
            }
        }
    }

    @ReactMethod
    public void discoverServices() {
        if (mBluetoothGatt != null) {
            mBluetoothGatt.discoverServices();
        }
    }

    @Override
    public String getName() {
        return "BLEConnectionModule";
    }


    @ReactMethod
    public void startScan() {
        clearOldDeviceList();
        /*onScanComplete = successCallback;
        onScanError = errorCallback;*/
        scanDevice(true);
    }

    private void clearOldDeviceList() {
        if (bleArrayList != null && bleArrayList.size() > 0) {
            bleArrayList.clear();
        }
    }

    private void scanDevice(final boolean enable) {
        if (enable) {
            // Stops scanning after a pre-defined scan period.
            /*Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    mScanning = false;
                    *//*mBluetoothAdapter.stopLeScan(leScanCallback);*//*
                    if (bleArrayList != null && bleArrayList.size() > 0) {
                        Gson gson = new Gson();
                        String jsonString = gson.toJson(getDeviceModelList(bleArrayList));
                        onScanComplete.invoke(jsonString);
                    } else {
                        CommonUtilities.showToast(Constants.NO_DEVICE_DETECTED_MSG, mContext);
                        onScanError.invoke(Constants.NO_DEVICE_DETECTED_MSG);
                    }
                }
            }, Constants.SCAN_PERIOD);*/

            mScanning = true;
            mBluetoothAdapter.startLeScan(leScanCallback);
        } else {
            mScanning = false;
            mBluetoothAdapter.stopLeScan(leScanCallback);
        }
    }

    @ReactMethod
    public void stopScan() {
        mScanning = false;
        if (mBluetoothAdapter != null) {
            mBluetoothAdapter.stopLeScan(leScanCallback);
        }
    }

    /*private ArrayList<DeviceDetailModel> getDeviceModelList(ArrayList<BluetoothDevice> bleArrayList) {
        ArrayList<DeviceDetailModel> deviceDetailModels = new ArrayList<>();
        for (int count = 0; count < bleArrayList.size(); count++) {
            BluetoothDevice bluetoothDevice = bleArrayList.get(count);
            deviceDetailModels.add(new DeviceDetailModel(bluetoothDevice.getAddress(), bluetoothDevice.getName()));
        }
        return deviceDetailModels;
    }*/

    BluetoothAdapter.LeScanCallback leScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {
            ((MainActivity) mContext).runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    addDevice(device);
                    if (bleArrayList != null && bleArrayList.size() > 0) {
                        /*WritableMap params = Arguments.createMap();
                        params.putString(Constants.DEVICE, jsonString);*/
                        Gson gson = new Gson();
                        final String jsonString = gson.toJson(getDeviceModel(device));
                        sendEvent(reactContext, "device_params", null, jsonString);
                        final Handler handler = new Handler();
                        handler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                stopScan();

                            }
                        }, 10000);
                        /*if (onScanComplete != null && jsonString != null) {

                            final Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                @Override
                                public void run() {

                                    onScanComplete.invoke(jsonString);
                                }
                            }, 5000);

                        }*/
                    } else {
                        /*CommonUtilities.showToast(Constants.NO_DEVICE_DETECTED_MSG, mContext);
                        onScanError.invoke(Constants.NO_DEVICE_DETECTED_MSG);*/
                    }
                }
            });
        }
    };

    private DeviceDetailModel getDeviceModel(BluetoothDevice device) {
        DeviceDetailModel deviceDetailModel = new DeviceDetailModel(device.getAddress(), device.getName());
        return deviceDetailModel;
    }

    public void addDevice(BluetoothDevice device) {
        if (!isContains(device)) {
            bleArrayList.add(device);
        } else {
            if (findResult != null) {
                int index = bleArrayList.indexOf(findResult);
                bleArrayList.set(index, device);
            }
        }
    }

    public boolean isContains(BluetoothDevice dstDevice) {
        boolean val = false;
        findResult = null;
        for (BluetoothDevice bluetoothDevice : bleArrayList) {
            if (bluetoothDevice.getAddress().equals(dstDevice.getAddress())) {
                val = true;
                findResult = bluetoothDevice;
                break;
            }
        }
        return val;
    }

    public List<BluetoothGattService> getSupportedGattServices() {
        if (mBluetoothGatt == null) return null;
        return mBluetoothGatt.getServices();
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params, String jsonString) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, jsonString);
    }
}

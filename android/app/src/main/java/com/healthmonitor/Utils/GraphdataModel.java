package com.healthmonitor.Utils;

/**
 * Created by dmota on 07/04/16.
 */
public class GraphdataModel {
    int[] elevationData;
    int[] timeData;
    int[] speedData;
    int[] timeDataForSpeed;
    int[] heartBeatData;
    int[] timeData_heart;

    public int[] getElevationData() {
        return elevationData;
    }

    public void setElevationData(int[] elevationData) {
        this.elevationData = elevationData;
    }

    public int[] getTimeData() {
        return timeData;
    }

    public void setTimeData(int[] timeData) {
        this.timeData = timeData;
    }

    public int[] getSpeedData() {
        return speedData;
    }

    public void setSpeedData(int[] speedData) {
        this.speedData = speedData;
    }

    public int[] getTimeDataForSpeed() {
        return timeDataForSpeed;
    }

    public void setTimeDataForSpeed(int[] timeDataForSpeed) {
        this.timeDataForSpeed = timeDataForSpeed;
    }

    public int[] getHeartBeatData() {
        return heartBeatData;
    }

    public void setHeartBeatData(int[] heartBeatData) {
        this.heartBeatData = heartBeatData;
    }

    public int[] getTimeData_heart() {
        return timeData_heart;
    }

    public void setTimeData_heart(int[] timeData_heart) {
        this.timeData_heart = timeData_heart;
    }
}

import React, { Component } from 'react';
import "../MapArea/css/resize.css";
import MapArea from "../MapArea";
import DataArea from "../DataArea";
import DropArea from "../DropArea";
import WebSocketManager from "../../helpers/WebSocketManager";
import { predictCDA, predictPayload } from "../../helpers/predictions";
import { getDirection } from "../../helpers/direction";
import { predictLoc } from "../../helpers/location";

class GroundStation extends Component {
  state = {
    currentData: { // set an initial state for everything
      latitude: 0,
      longitude: 0,
      altitude: 0,
      bearing: 0,
      direction: 0,
      velocity: 0,
      headwind: 0,
      payloadLat: 0,
      payloadLong: 0,
      timeElapsed: 0,
      pitch: 0,
      roll: 0,
      yaw: 0,
      cdaLat: 0,
      cdaLong: 0,
      voltage: 0,
      current: 0,
      cargoDropped: false,
      cdaDropped: false,
      CDAPredictionDistance: 0,
      payloadPredictionDistance: 0,
    },
    isConnected: false,
  };

  dataLog = [];

  planePositionHistory = [];

  setDropped = (drop, value) => {
    const change = { flightData: {} };
    change.flightData[drop] = value;
    this.setData(change);
  };

  setData = (data) => {
    console.log(data);
    const time = +Date.now();
    const timeElapsed = time - this.state.lastPacketTime;
    const { currentData } = this.state;
    this.state.lastPacketTime = time;
    if (data.flightData) {
      const flightData = { ...currentData, ...data.flightData }; // merge old data with new data
      flightData.timeRecieved = (time / 1000) || 0;
      flightData.timeElapsed = timeElapsed;

      flightData.payloadPredictionDistance = predictPayload(flightData.pitch, flightData.altitude, flightData.velocity, flightData.headwind);
      flightData.CDAPredictionDistance = predictCDA(flightData.pitch, flightData.altitude, flightData.velocity, flightData.headwind);

      flightData.direction = getDirection(currentData, flightData);

      /* eslint prefer-destructuring:0 */
      data.flightData.direction += this.state.oldDirection;
      const payloadLatLong = predictLoc(flightData, flightData.payloadPredictionDistance);
      flightData.payloadLat = payloadLatLong[0];
      flightData.payloadLong = payloadLatLong[1];
      const cdaLatLong = predictLoc(flightData, flightData.CDAPredictionDistance);
      flightData.cdaLat = cdaLatLong[0];
      flightData.cdaLong = cdaLatLong[1];

      this.planePositionHistory.push([flightData.latitude, flightData.longitude]);
      this.dataLog.push(flightData);
      this.setState({ currentData: flightData });
    }
  };

  setConnected = (isConnected) => {
    this.setState({ isConnected });
  };

  getConnected = () => {
    return this.state.isConnected;
  };

  webSocketManager = new WebSocketManager(this.setData, this.setConnected, this.getConnected);

  clearDataLog = () => {
    this.dataLog = [];
  };

  clearRoute = () => {
    this.planePositionHistory = [];
  };

  render() {
    const { currentData, isConnected } = this.state;
    return (
      <div
        style={{
          paddingLeft: 0,
          paddingBottom: "1em",
          paddingTop: "1em",
          border: "none",
          height: "100%",
          boxSizing: "content-box",
          paddingRight: 0,
          maxWidth: "100%",
        }}
      >
        <div style={{ display: "flex", height: "calc(100% - 2em)", overflow: "hidden", overflowX: "auto", paddingBottom: "1em" }}>
          <MapArea currentData={currentData} planePositionHistory={this.planePositionHistory} clearRoute={this.clearRoute} />
          <DataArea
            dataLog={this.dataLog}
            saveLog={this.saveDataLog}
            clearLog={this.clearDataLog}
            receiveData={this.receiveData}
            currentData={currentData}
            webSocketManager={this.webSocketManager}
            isConnected={isConnected}
          />
          <DropArea
            currentData={currentData}
            webSocketManager={this.webSocketManager}
            isConnected={isConnected}
            cargoDropped={currentData.cargoDropped}
            cdaDropped={currentData.cdaDropped}
            setDropped={this.setDropped}
          />
        </div>
      </div>
    );
  }
}

export default GroundStation;

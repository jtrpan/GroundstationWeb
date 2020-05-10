import React, { Component } from 'react';

class DataDisplay extends Component {
  render() {
    const { currentData } = this.props;
    if (!currentData) {
      return (
        <div style={{ color: "grey" }}>
            No Flight Data received
        </div>
      );
    }
    return (
      <div style={{ minWidth: "320px", overflow: "hidden", fontSize: "12pt" }}>
        <table id="flight_data_table">
          <tbody>
            <tr>
              <td>Latitude</td>
              <td>{`${Math.round(currentData.latitude*100000)/100000}º`}</td>
            </tr>
            <tr>
              <td>Longitude</td>
              <td>{`${Math.round(currentData.longitude*100000)/100000}º`}</td>
            </tr>
            <tr>
              <td>Relative Direction</td>
              <td>{`${Math.round(currentData.direction * 100000) / 100000}º`}</td>
            </tr>
            <tr>
              <td>Altitude GPS (ft)</td>
              <td>{Math.round(currentData.altitude*100)/100}</td>
            </tr>
            <tr>
              <td>Velocity (m/s)</td>
              <td>{Math.round(currentData.velocity*100)/100}</td>
            </tr>
            <tr>
              <td>Headwind (m/s)</td>
              <td>{Math.round(currentData.headwind*100)/100}</td>
            </tr>
            <tr>
              <td>Roll (º)</td>
              <td>{Math.round(currentData.roll*100)/100}</td>
            </tr>
            <tr>
              <td>Pitch (º)</td>
              <td>{Math.round(currentData.pitch*100)/100}</td>
            </tr>
            <tr>
              <td>Yaw (º)</td>
              <td>{Math.round(currentData.yaw*100)/100}</td>
            </tr>
            <tr>
              <td>TimeElapsed</td>
              <td>{currentData.timeElapsed}</td>
            </tr>
            <tr>
              <td>Payload Prediction (ft)</td>
              <td>{Math.round(currentData.payloadPredictionDistance * 1000) / 1000 }</td>
            </tr>
            <tr>
              <td>CDA Prediction (ft)</td>
              <td>{Math.round(currentData.CDAPredictionDistance * 1000) / 1000}</td>
            </tr>
            <tr>
              <td>Voltage (V)</td>
              <td>{Math.round(currentData.voltage * 1000) / 1000}</td>
            </tr>
            <tr>
              <td>Current (A)</td>
              <td>{Math.round(currentData.current * 1000) / 1000}</td>
            </tr>
            <tr>
              <td>Power (W)</td>
              <td>{Math.round(currentData.voltage * currentData.current * 1000) / 1000}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default DataDisplay;

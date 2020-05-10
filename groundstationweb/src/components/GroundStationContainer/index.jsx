import React, { Component } from 'react';
import "./css/GroundStation.css";
import GroundStation from "../GroundStation";

class GroundStationContainer extends Component {
  render() {
    return (
      <div className="groundstation_container">
        <GroundStation />
      </div>
    );
  }
}

export default GroundStationContainer;

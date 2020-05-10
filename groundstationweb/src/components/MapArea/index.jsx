import React, { Component } from 'react';
import { Segment } from "semantic-ui-react";
import AeroMap from "./components/AeroMap";
import MapSettings from "./components/MapSettings";
import "./css/style.css";

class MapArea extends Component {
  state = {
    mapLat: 49.258063,
    mapLong: -123.195911,
    targLat: null,
    targLng: null,
    followPlane: false,
    drawPlane: true,
    drawTarget: true,
    drawCDAPredictionPoint: true,
    drawPayloadPredictionPoint: true,
    drawPlanePositionHistory: true,
    zoom: 10,
  };

  changeSettingsState = (state) => {
    this.setState(state);
  };

  zoomToPlane = () => {
    const { currentData } = this.props;
    if (!currentData) return;
    const { latitude, longitude } = currentData;
    const eps = Math.random()*0.00000001;
    this.setState({ mapLat: latitude+eps, mapLong: longitude+eps, zoom: 19+eps });
  };

  zoomToTarget = () => {
    const { targLat, targLng } = this.state;
    if (!targLat || !targLng) return;
    const eps = Math.random()*0.00000001;
    this.setState({ mapLat: targLat + eps, mapLong: targLng + eps, zoom: 19+eps });
  };

  setNewTarget = (inputLat, inputLng) => {
    this.setState({
      targLat: inputLat,
      targLng: inputLng,
    });
  };

  render() {
    const { currentData, planePositionHistory, clearRoute } = this.props;
    const {
      mapLat,
      mapLong,
      targLat,
      targLng,
      zoom,
      followPlane,
      drawPlane,
      drawTarget,
      drawCDAPredictionPoint,
      drawPayloadPredictionPoint,
      drawPlanePositionHistory,
    } = this.state;

    if (followPlane) {
      if (mapLat !== currentData.latitude || mapLong !== currentData.longitude) {
        this.setState({ mapLat: currentData.latitude, mapLong: currentData.longitude });
      }
    }

    return (
      <React.Fragment>
        <Segment
          style={{
            padding: "0px",
            display: "flex",
            borderLeft: "none",
            height: "100%",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <AeroMap
            planeLat={currentData.latitude}
            planeLong={currentData.longitude}
            mapLat={mapLat}
            mapLong={mapLong}
            targLat={targLat}
            targLng={targLng}
            zoom={zoom}
            drawPlane={drawPlane}
            drawTarget={drawTarget}
            drawPlanePositionHistory={drawPlanePositionHistory}
            drawCDAPredictionPoint={drawCDAPredictionPoint}
            drawPayloadPredictionPoint={drawPayloadPredictionPoint}
            payloadLat={currentData.payloadLat}
            payloadLong={currentData.payloadLong}
            cdaLat={currentData.cdaLat}
            cdaLong={currentData.cdaLong}
            planePositionHistory={planePositionHistory}
          />
        </Segment>
        <MapSettings
          drawPlane={drawPlane}
          drawTarget={drawTarget}
          drawCDAPredictionPoint={drawCDAPredictionPoint}
          drawPayloadPredictionPoint={drawPayloadPredictionPoint}
          drawPlanePositionHistory={drawPlanePositionHistory}
          followPlane={followPlane}
          zoomToPlane={this.zoomToPlane}
          zoomToTarget={this.zoomToTarget}
          changeSettingsState={this.changeSettingsState}
          setNewTarget={this.setNewTarget}
          targLat={targLat}
          targLng={targLng}
          clearRoute={clearRoute}
        />
      </React.Fragment>
    );
  }
}

export default MapArea;

import React, { Component } from 'react';
import { Header, Checkbox, Segment, Button, Input, Popup } from "semantic-ui-react";
import DomArea from "../../DomArea";

class MapSettings extends Component {
  state = {
    showPopup: false,
    pTLat: 49.258063,
    pTLng: -123.195911,
  };

  handleOpen = () => {
    this.setState({ showPopup: true });
  };

  handleClose = () => {
    this.setState({ showPopup: false });
  };

  passTarget = () => {
    const { pTLat, pTLng } = this.state;
    this.props.setNewTarget(pTLat, pTLng);
  };

  setTLAT = (event) => {
    if (!(event.target.value > 90 || event.target.value < -90)) {
      this.setState({ pTLat: event.target.value });
    }
  };

  setTLNG = (event) => {
    if (!(event.target.value > 180 || event.target.value < -180)) {
      this.setState({ pTLng: event.target.value });
    }
  };

  render() {
    const {
      changeSettingsState,
      drawPlane,
      drawTarget,
      drawCDAPredictionPoint,
      drawPayloadPredictionPoint,
      drawPlanePositionHistory,
      followPlane,
      zoomToPlane,
      zoomToTarget,
      clearRoute,
      targLat,
      targLng,
    } = this.props;
    const {
      pTLat,
      pTLng,
      showPopup,
    } = this.state;
    return (
      <DomArea header="Map Settings" style={{ minWidth: "250px" }}>
        <Segment style={{ display: "flex", flexDirection: "column" }}>
          <Header as="h5">Display Settings:</Header>
          <Checkbox
            toggle
            label="Plane"
            checked={drawPlane}
            onChange={() => { changeSettingsState({ drawPlane: !drawPlane }); }}
          />
          <Checkbox
            toggle
            label="Target"
            checked={drawTarget}
            onChange={() => { changeSettingsState({ drawTarget: !drawTarget }); }}
          />
          <Checkbox
            toggle
            label="CDA Prediction Point"
            checked={drawCDAPredictionPoint}
            onChange={() => { changeSettingsState({ drawCDAPredictionPoint: !drawCDAPredictionPoint }); }}
          />
          <Checkbox
            toggle
            label="Payload Prediction Point"
            checked={drawPayloadPredictionPoint}
            onChange={() => { changeSettingsState({ drawPayloadPredictionPoint: !drawPayloadPredictionPoint }); }}
          />
          <Checkbox
            toggle
            label="Wind direction"
          />
          <Checkbox
            toggle
            label="Heading"
          />
        </Segment>
        <Segment style={{ display: "flex", flexDirection: "column" }}>
          <Header as="h5">Movement:</Header>
          <Button
            style={{ marginBottom: "0.5em" }}
            basic
            content="Zoom camera to plane"
            onClick={zoomToPlane}
            icon="plane"
          />
          <Button
            style={{ marginBottom: "0.5em" }}
            basic
            content="Zoom camera to target"
            onClick={zoomToTarget}
            icon="target"
            disabled={followPlane}
          />
          <Checkbox
            toggle
            label="Follow Plane"
            checked={followPlane}
            onChange={() => {
              changeSettingsState({ followPlane: !followPlane });
            }}
          />
          <Checkbox
            toggle
            label="Trace Plane Route"
            checked={drawPlanePositionHistory}
            onChange={() => { changeSettingsState({ drawPlanePositionHistory: !drawPlanePositionHistory }); }}
          />
          <Button
            style={{ marginBottom: "0.5em" }}
            basic
            content="Clear Traced Route"
            onClick={clearRoute}
            icon="delete"
          />
        </Segment>

        <Segment style={{ display: "flex", flexDirection: "column" }}>
          <Header as="h5">Target:</Header>
          <p>
            Latitude:&nbsp;
            <strong>{targLat}</strong>
          </p>
          <p>
            Longitude:&nbsp;
            <strong>{targLng}</strong>
          </p>
          <React.Fragment>
            <Popup
              trigger={<Button icon="target" basic content="Input Target Location" />}
              on="click"
              position="bottom center"
              open={showPopup}
              onOpen={this.handleOpen}
              onClose={this.handleClose}
            >
              <Input
                size="mini"
                label={{ basic: true, content: '°N' }}
                labelPosition="right"
                placeholder="Latitude..."
                type="number"
                value={pTLat}
                onChange={this.setTLAT}
                style={{ marginBottom: "0.5em", minWidth: "200px" }}
                fluid
              />
              <Input
                size="mini"
                label={{ basic: true, content: '°W' }}
                labelPosition="right"
                placeholder="Longitude..."
                type="number"
                value={pTLng}
                onChange={this.setTLNG}
                style={{ marginBottom: "0.5em" }}
                fluid
              />
              <Button
                size="mini"
                fluid
                basic
                icon="check"
                primary
                content="Set Location"
                onClick={() => {
                  this.passTarget();
                  this.handleClose();
                }}
              />
            </Popup>
          </React.Fragment>
        </Segment>
      </DomArea>
    );
  }
}

export default MapSettings;

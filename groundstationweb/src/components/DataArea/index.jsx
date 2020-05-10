import React, { Component } from 'react';
import { Segment, Header } from "semantic-ui-react";
import CommunicationArea from "../CommunicationArea";
import DataDisplay from "./components/DataDisplay";
import DomArea from "../DomArea";
import "./style.css";
import LoggerArea from "./components/LoggerArea";

class DataArea extends Component {
  render() {
    const { receiveData, currentData, saveLog, clearLog, dataLog, webSocketManager, isConnected } = this.props;
    return (
      <DomArea header="Data">
        <CommunicationArea receiveData={receiveData} webSocketManager={webSocketManager} isConnected={isConnected} />
        <Segment>
          <Header as="h5" style={{ marginBottom: "0px" }}>Live Flight Data:</Header>
          <DataDisplay currentData={currentData} />
        </Segment>
        <LoggerArea saveLog={saveLog} clearLog={clearLog} dataLog={dataLog} />
      </DomArea>
    );
  }
}

export default DataArea;

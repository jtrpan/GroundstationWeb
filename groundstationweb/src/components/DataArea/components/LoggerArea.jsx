import React, { Component } from 'react';
import { Segment, Header, Button, Modal, Icon, Table } from "semantic-ui-react";

class LoggerArea extends Component {
  state = {
    confirmationOpen: false,
    exportModalOpen: false,
  };

  download = (filename, text) => {
    const pom = document.createElement('a');
    pom.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    pom.setAttribute('download', filename);

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  };

  saveDataLog = () => {
    const { dataLog } = this.props;
    try {
      if (dataLog.length < 1) return;
      let csv = "";
      const keys = Object.keys(dataLog[dataLog.length - 1]);
      keys.forEach((key) => { csv = `${csv}${key}, `; });
      csv = `${csv}\n`;
      dataLog.forEach((row) => {
        keys.forEach((key) => {
          csv = `${csv}${row[key]},`;
        });
        csv = `${csv}\n`;
      });
      this.download(`Flight Log ${new Date().toISOString()}.csv`, csv);
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { clearLog, dataLog } = this.props;
    const { confirmationOpen, exportModalOpen } = this.state;
    return (
      <React.Fragment>
        <Segment>
          <Header as="h5">Log Data:</Header>
          <div style={{ width: "100%" }}>
            <div style={{ margin: "auto", width: "max-content" }}>
              <Button content="View Log" icon="eye" basic onClick={() => { this.setState({ exportModalOpen: true }); }} />
              <Button content="Clear Log" icon="cancel" negative basic onClick={() => { this.setState({ confirmationOpen: true }); }} />
            </div>
          </div>
        </Segment>
        {exportModalOpen && (
          <Modal
            open
            size="large"
            onClose={() => { this.setState({ exportModalOpen: false }); }}
          >
            <Modal.Header>
                  View Log
            </Modal.Header>
            <Modal.Content scrolling>
              {dataLog.length > 0 ? (
                <Table compact>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Time</Table.HeaderCell>
                      <Table.HeaderCell>Altitude (ft)</Table.HeaderCell>
                      <Table.HeaderCell>Velocity (m/s)</Table.HeaderCell>
                      <Table.HeaderCell>Latitude</Table.HeaderCell>
                      <Table.HeaderCell>Longitude</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {dataLog.map((d) => {
                      return (
                        <Table.Row>
                          <Table.Cell>{d.timereceived}</Table.Cell>
                          <Table.Cell>{d.altitude}</Table.Cell>
                          <Table.Cell>{d.velocity}</Table.Cell>
                          <Table.Cell>{d.latitude}</Table.Cell>
                          <Table.Cell>{d.longitude}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              ) : (
                <span style={{ color: "grey" }}>
                  There has been no data received
                </span>
              )}
            </Modal.Content>
            <Modal.Actions>
              <Button
                style={{ float: "left" }}
                content="Cancel"
                onClick={() => { this.setState({ exportModalOpen: false }); }}
              />
              <Button
                style={{ float: "left" }}
                negative
                disabled={dataLog.length === 0}
                content="Clear Log"
                onClick={() => { this.setState({ confirmationOpen: true }); }}
              />
              <Button
                disabled={dataLog.length === 0}
                primary
                content="Export Log"
                onClick={() => { this.saveDataLog(); this.setState({ exportModalOpen: false }); }}
              />
            </Modal.Actions>
          </Modal>
        )}
        {confirmationOpen && (
          <Modal open>
            <Modal.Header>
                  Are you sure you want to clear the flight log?
            </Modal.Header>
            <Modal.Content>
              <div style={{ padding: "1em" }}>
                <Icon name="exclamation" size="big" color="red" />
                    This action cannot be undone.
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button
                content="Cancel"
                onClick={() => { this.setState({ confirmationOpen: false }); }}
              />
              <Button
                negative
                content="Clear Log"
                onClick={() => { this.setState({ confirmationOpen: false }); clearLog(); }}
              />
            </Modal.Actions>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default LoggerArea;

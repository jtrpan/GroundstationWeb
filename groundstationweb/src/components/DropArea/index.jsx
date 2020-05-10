import React, { Component } from 'react';
import { Segment, Header, Button, Icon, Modal, Statistic, Card, Dropdown } from "semantic-ui-react";
import DomArea from "../DomArea";
import "./style.css";

const textSizes = [
  {
    key: 'Mini',
    text: 'Mini',
    value: 'mini',
  },
  {
    key: 'Small',
    text: 'Small',
    value: 'small',
  },
  {
    key: 'Large',
    text: 'Large',
    value: 'large',
  },
  {
    key: 'Huge',
    text: 'Huge',
    value: 'huge',
  },
];


class DropArea extends Component {
  state = {
    habAlt: 0,
    cdaAlt: 0,
    confirmationOpen1: false,
    confirmationOpen2: false,
    confirmationOpen3: false,
    confirmationOpen4: false,
    fontSize: 'large',
  };

  handleSizeChange = (event, data) => {
    this.setState({ fontSize: data.value });
  };

  dropPayload = () => {
    const { currentData, webSocketManager, isConnected, cargoDropped, setDropped } = this.props;
    if (!isConnected) {
      this.setState({ confirmationOpen4: true });
      return;
    }
    if (!cargoDropped && currentData) {
      // SEND SIGNAL THROUGH SERVER TO PHONE, PHONE SHOULD INTERPRET THIS INPUT AND TELL SERVO TO RELEASE WATER + HABITATS

      webSocketManager.release("a");
      this.setState({ habAlt: currentData.altitude });

      setDropped("cargoDropped", true);
      // send signal to phone to release
    } else if (cargoDropped) {
      this.setState({ confirmationOpen1: true });
    }
  };

  releaseCDA = () => {
    const { currentData, webSocketManager, isConnected, cdaDropped, setDropped } = this.props;
    if (!isConnected) {
      this.setState({ confirmationOpen4: true });
      return;
    }
    if (!cdaDropped && currentData) {
      // SEND SIGNAL THROUGH SERVER TO PHONE, PHONE SHOULD INTERPRET THIS INPUT AND TELL SERVO TO RELEASE CDA 1
      webSocketManager.release("c");
      this.setState({ cdaAlt: currentData.altitude });
      setDropped("cdaDropped", true);
      // send signal to phone to release
    } else if (cdaDropped) {
      this.setState({ confirmationOpen2: true });
    }
  };

  resetDrops = () => {
    this.setState({ confirmationOpen3: true });
  };

  render() {
    const { habAlt, cdaAlt, confirmationOpen1, confirmationOpen2, confirmationOpen3, confirmationOpen4, fontSize } = this.state;
    const { setDropped } = this.props;
    return (
      <DomArea header="Payload Release">
        <Segment>
          <Header as="h4">
              Airdrop: &emsp; &emsp; &emsp; &emsp; &emsp;
            <Button basic color="red" content="Reset Drops" icon="repeat" compact="true" onClick={this.resetDrops} />
          </Header>
          <div style={{ width: "100%", overflow: "hidden", fontSize: "12pt" }}>
            <Card>
              <Card.Content>
                <Header
                  as="h3"
                  icon="tint"
                  color="blue"
                  content="Water"
                  floated="left"

                />
                <Header
                  as="h3"
                  icon="home"
                  color="brown"
                  content="Habitat"
                  floated="right"
                />
                <Header
                  color="black"
                  textAlign="center"
                  content={(
                    <span>
                      &emsp;
                      <Statistic horizontal label="ft." value={habAlt} size={fontSize} />
                      &emsp;
                    </span>
                  )}
                />
              </Card.Content>
              <Button
                basic
                color="black"
                compact="true"
                onClick={this.dropPayload}
                content={(
                  <span>
                    <Icon fitted name="tint" color="blue" />
                          &nbsp; + &nbsp;
                    <Icon
                      fitted
                      name="home"
                      color="brown"
                    />
                          &nbsp; Drop
                  </span>
                    )}
              />
            </Card>
            <Card>
              <Card.Content>
                <Header
                  as="h3"
                  icon="paper plane"
                  color="violet"
                  content="Colonist Delivery Aircrafts"
                />

                <Header
                  color="black"
                  textAlign="center"
                  content={(
                    <span>
                      <Statistic horizontal label="ft." value={cdaAlt} size={fontSize} />
                      &emsp;
                    </span>
                      )}
                />
              </Card.Content>
              <Button basic color="violet" content="Release" icon="space shuttle" onClick={this.releaseCDA} />
            </Card>
          </div>
          <Modal
            open={confirmationOpen1}
          >
            <Modal.Header>
                Notice: Cargo
            </Modal.Header>
            <Modal.Content>
              <div style={{ padding: "1em" }}>
                <Icon name="exclamation" size="big" color="yellow" />
                  Both the water module and the habitat module have already been released.
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button
                content="OK"
                color="green"
                onClick={() => { this.setState({ confirmationOpen1: false }); }}
              />
              <Button
                negative
                content="Reset Payload Release"
                onClick={() => {
                  this.setState({
                    confirmationOpen1: false,
                    habAlt: 0,
                  });
                  setDropped("cargoDropped", false);
                }}
              />
            </Modal.Actions>
          </Modal>
          <Modal
            open={confirmationOpen2}
          >
            <Modal.Header>
                Notice: Gliders
            </Modal.Header>
            <Modal.Content>
              <div style={{ padding: "1em" }}>
                <Icon name="exclamation" size="big" color="yellow" />
                  All three of the CDAs have already been released.
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button
                content="OK"
                color="green"
                onClick={() => { this.setState({ confirmationOpen2: false }); }}
              />
              <Button
                negative
                content="Reset CDA Release"
                onClick={() => {
                  this.setState({
                    confirmationOpen2: false,
                    cdaAlt: 0,
                  });
                  setDropped("cdaDropped", false);
                }}
              />
            </Modal.Actions>
          </Modal>
          <Modal
            open={confirmationOpen3}
          >
            <Modal.Header>
                Alert: Reset Payload + CDA Drop
            </Modal.Header>
            <Modal.Content>
              <div style={{ padding: "1em" }}>
                <Icon name="exclamation" size="big" color="red" />
                  Are you sure you want to clear all of the current drop values? This action cannot be undone.
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button
                negative
                content="Reset Drops"
                onClick={() => {
                  this.setState({
                    confirmationOpen3: false,
                    habAlt: 0,
                    cdaAlt: 0,
                  });
                  setDropped("cdaDropped", false);
                  setDropped("cargoDropped", false);
                }}
              />
              <Button
                content="Cancel"
                onClick={() => { this.setState({ confirmationOpen3: false }); }}
              />
            </Modal.Actions>
          </Modal>
          <Modal
            open={confirmationOpen4}
          >
            <Modal.Header>
                Error: No Connection
            </Modal.Header>
            <Modal.Content>
              <div style={{ padding: "1em" }}>
                <Icon name="exclamation" size="big" color="red" />
                  Groundstation encountered an error communicating with the aircraft. Please check connection to the server.
              </div>
            </Modal.Content>
            <Modal.Actions>
              <Button
                content="Dismiss"
                onClick={() => {
                  this.setState({
                    confirmationOpen4: false,
                  });
                }}
              />
            </Modal.Actions>
          </Modal>
        </Segment>
        <Segment>
          <Header as="h4">
              Display Settings: &emsp; &emsp; &emsp; &emsp;
          </Header>
          <Dropdown
            placeholder="Text Size"
            fluid
            selection
            options={textSizes}
            onChange={this.handleSizeChange}
            value={fontSize}
          />
        </Segment>
      </DomArea>
    );
  }
}
export default DropArea;

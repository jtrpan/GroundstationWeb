import React, { Component } from 'react';
import { Segment, Header, Icon, Button } from "semantic-ui-react";

class CommunicationArea extends Component {
  render() {
    const { webSocketManager, isConnected } = this.props;
    return (
      <Segment>
        <Header as="h5" style={{ marginBottom: "0px" }}>Communication:</Header>
        <div style={{ color: "grey" }}>
            Connection status:&nbsp;
          {isConnected ? (
            <strong style={{ color: "limegreen" }}>Connected</strong>
          ): (
            <span>
              <strong style={{ color: "firebrick" }}>Not Connected</strong>
                  &nbsp;
              <Icon link name="sync" onClick={webSocketManager.connect} />
            </span>

          )}

          <Button icon="send" content="Send Test Data" fluid basic onClick={webSocketManager.testData} />
        </div>
      </Segment>
    );
  }
}

export default CommunicationArea;

/* <Button icon="wifi" content="Ping Aircraft" fluid basic onClick={webSocketManager.ping} /> */

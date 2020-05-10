import React, { Component } from 'react';
import { Segment, Header, Icon } from "semantic-ui-react";

class Index extends Component {
  state = {
    expanded: true,
  };

  contract = () => {
    this.setState({ expanded: false });
  };

  expand = () => {
    this.setState({ expanded: true });
  };

  getStyle = () => {
    if (this.state.expanded) return this.props.style || {};
    return { width: "0px", height: "0px", overflow: "hidden" };
  };

  render() {
    const { expanded } = this.state;
    const { header, children } = this.props;
    return (
      <Segment
        style={{
          height: "100%",
          marginTop: "0px",
          marginLeft: "1em",
          boxSizing: "border-box",
          transition: "maxWidth 1s",
          maxWidth: expanded ? "max-content" : "50px",
        }}
        className={expanded ? "" : "clickable"}
        onClick={expanded ? null : this.expand}
      >
        {expanded ? (
          <React.Fragment>
            <Header as="h4" onClick={this.contract} className="clickable">
              <Icon color="grey" link name="angle left" />
              {header}
              {":"}
            </Header>
          </React.Fragment>
        ) : (
          <div style={{ height: "100%" }}>
            <Icon color="grey" size="large" link name="angle right" onClick={this.expand} />
            <Header as="h3" style={{ transform: "rotate(90deg)", whiteSpace: "nowrap" }}>
              {header}
            </Header>
          </div>
        )}
        <div style={this.getStyle()}>
          {children}
        </div>
      </Segment>
    );
  }
}

export default Index;

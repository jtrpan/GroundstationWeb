import React, { Component } from 'react';
import { ResizableBox } from 'react-resizable';
import { ReactBingmaps } from 'react-bingmaps';
import "../css/resize.css";

class AeroMap extends Component {
  render() {
    const {
      planeLat,
      planeLong,
      mapLat,
      mapLong,
      targLat,
      targLng,
      zoom,
      drawPlane,
      drawTarget,
      drawCDAPredictionPoint,
      drawPayloadPredictionPoint,
      drawPlanePositionHistory,
      payloadLat,
      payloadLong,
      cdaLat,
      cdaLong,
      planePositionHistory,
    } = this.props;

    const polygons = [];

    const polyline = {
      location: drawPlanePositionHistory ? planePositionHistory : [],
      option: {
        strokeColor: "rgba(255,255,255,0.7)",
        strokeThickness: 2.5,
        strokeDashArray: [4, 4],
      },
    };

    if (drawPlane) {
      polygons.push({
        center: [planeLat, planeLong],
        radius: 0.002,
        points: 20,
        option: {
          fillColor: "rgba(230, 0, 0, 0.7)",
          strokeThickness: 2,
        },
      });
    }

    if (drawTarget) {
      polygons.push({
        center: [targLat, targLng],
        radius: 0.0094697, // 50 feet = 0.0094697 miles
        points: 80,
        option: {
          strokeColor: "#ff0000",
          fillColor: "rgba(84, 209, 71, 0.7)",
          strokeThickness: 2,
          strokeDashArray: [1, 2],
        },
      });
    }

    if (drawPayloadPredictionPoint) {
      polygons.push({
        center: [payloadLat, payloadLong], // paints predicted payload location on map in purple
        radius: 0.001,
        points: 80,
        option: {
          fillColor: "rgba(104, 242, 233, 0.7)",
          strokeThickness: 1,
        },
      });
    }

    if (drawCDAPredictionPoint) {
      polygons.push({
        center: [cdaLat, cdaLong], // paints predicted CDA Location on map in purple
        radius: 0.001,
        points: 80,
        option: {
          fillColor: "rgba(251, 189, 8, 0.7)",
          strokeThickness: 1,
        },
      });
    }


    // let coordinates = [payloadLat, payloadLong],[cdaLat, cdaLong];
    const height = window.innerHeight - 31;
    return (
      <div>
        <ResizableBox
          width={600}
          height={height}
          axis="x"
          handleSize={[20, 20]}
          minConstraints={[100, height]}
        >
          <div style={{ backgroundColor: "#999", width: "100%", height: "100%", overflow: "hidden" }}>
            <ReactBingmaps
              bingmapKey="AszsKaHJ3M1aGYwWB85QjTHkpEs8wTow6nOYAzOMDxOCopJSupN6RLCPkbVR42jF"
              disableStreetside
              center={[mapLat, mapLong]}
              zoom={zoom}
              polyline={polyline}
              regularPolygons={polygons}
            />
          </div>
        </ResizableBox>
      </div>
    );
  }
}

export default AeroMap;

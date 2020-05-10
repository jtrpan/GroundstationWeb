// eslint-disable-next-line no-unused-vars
const localServer = "ws://localhost:8888";
const remoteServer = "ws://104.248.73.89:8888";// ?????
const server = remoteServer;

class WebSocketManager {
  constructor(setData, setConnected, getConnected) {
    this.setData = setData;
    this.setConnected = setConnected;
    this.getConnected = getConnected;
    this.connect();
  }

    connect = () => {
      console.info("Connecting....");
      this.connection = new WebSocket(server);

      this.connection.onopen = () => {
        this.setConnected(true);
        console.info("Connected to server", this.getConnected);
      };

      this.connection.onerror = (error) => {
        console.error(
          "Socket encountered error: ",
          error.message,
          "Closing socket",
        );
        this.connection.close();
        console.info("Connection error", error);
      };
      this.connection.onmessage = (e) => {
        this.receiveData(e.data);
      };
      this.connection.onclose = () => {
        console.info("Disconnected from server");
        this.setConnected(false);
      };
    };

  receiveData = (rawData) => {
    this.setData(JSON.parse(rawData));
  };

  testData = () => {
    if (!this.getConnected()) {
      console.warn("Cannot send. Not connected");
      return;
    }
    const data = JSON.stringify(
      {
        type: "test_data",
        flightData: {
          latitude: 49.258063+Math.random()*0.00111,
          longitude: -123.195911+Math.random()*0.00111,
          altitude: 45.3,
          velocity: 10.3,
          headwind: -0.9,
        },
      },
    );
    console.info("Sending test data:", data);
    this.connection.send(data);
  };

  release = (identity) => {
    if (!this.getConnected()) {
      console.warn("Cannot drop. Not connected");
      return;
    }
    const message = JSON.stringify(
      {
        type: "command",
        command: {
          // drop details
          object: identity,
        },
      },
    );
    console.info("Sending drop signal:", message);
    this.connection.send(message);
  };
}
export default WebSocketManager;

import React from "react";
import PropTypes from "prop-types";
import base from "../base";

class App extends React.Component {
  state = {
    songs: {},
    order: {}
  };

  static propTypes = {
    match: PropTypes.object
  };

  componentDidMount() {
    this.ref = base.syncState(`songs`, {
      context: this,
      state: "songs"
    });
  }

  componentDidUpdate() {
    console.log(this.state.songs);
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  render() {
    return (
      <div>
        <div>
          <h1>AudioForma</h1>
          <ul className="songs"></ul>
        </div>
      </div>
    );
  }
}

export default App;

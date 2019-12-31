import React from "react";
import PropTypes from "prop-types";

const Authenticate = props => (
  <nav className="login">
    <h2>Authenticate with Spotify</h2>
    <p>If you use Spotify, we can visualize your song library for you.</p>
    <button className="spotify" onClick={() => props.authenticate("Github")}>
      Show me my Spotify Library!
    </button>
    <button className="noThanks" onClick={() => props.authenticate("Facebook")}>
      No Thanks
    </button>
  </nav>
);

Login.propTypes = {
  authenticate: PropTypes.func.isRequired
};

export default Authenticate;

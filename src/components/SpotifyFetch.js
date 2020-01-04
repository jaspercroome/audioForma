import React from "react";
import base from "../base";
import SpotifyWebApi from "spotify-web-api-js";

class SpotifyFetch extends React.Component {
  state = {
    songs: {},
    token : this.props.location.hash.split("=",2)[1].split("&",1),
    songData:{tracks:{},audioFeatures:{},playlistData:{}}
  }


  componentDidMount(){
    this.ref = base.syncState(`songs`, {
      context: this,
      state: "songs"
    });
    var spotify = new SpotifyWebApi();
    spotify.setAccessToken(this.state.token[0])
    // spotify.getUserPlaylists()
    //   .then(data=>{
    //     this.setState({
    //       playlistData: data
    //     })
    //   })
    //   .catch(error=>{console.log(error)})
  }
  
  componentDidUpdate() {
    var spotify = new SpotifyWebApi();
    spotify.setAccessToken(this.state.token[0])
    // spotify.getTracks(this.state.songs)
    //   .then(data=>{
    //     this.setState({
    //       tracks: data
    //     })
    //   })
    //   .catch(error=>{console.log(error)})
    spotify.getAudioFeaturesForTracks(this.state.songs)
      .then(data=>{
        this.setState({
          audioFeatures: data['audio_features']
        })
      })
      .catch(error=>{console.log(error)})
    }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  render(){
    return (
      this.state.token
  );
  }
};

export default SpotifyFetch;

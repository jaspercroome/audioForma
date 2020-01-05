import React, {useState, useEffect} from "react";
import songs from "../songs";
import SpotifyWebApi from "spotify-web-api-js";
import Bubble from "./Bubble"

function SpotifyFetch(){
  const starterSongs = songs;
  const token = window.location.hash.split("=",2)[1].split("&",1)[0]

  const [savedTracks, setSavedTracks] = useState({})
  const [tracks, setTracks] = useState({})
  const [audioFeatures, setAudioFeatures] = useState([])
  const [playlistData, setPlaylistData] = useState({})


    
  const spotifyPlaylists = () => { var spotify = new SpotifyWebApi();
    spotify.setAccessToken(token)
    spotify.getUserPlaylists()
      .then(data=>{
        setPlaylistData(data)
      })
      .catch(error=>{console.log(error)})
  }
  
  const spotifyAudioFeatures = () => {
    var spotify = new SpotifyWebApi();
    spotify.setAccessToken(token)
    spotify.getAudioFeaturesForTracks(starterSongs)
    .then(data=>{
      setAudioFeatures(data['audio_features'])
    })
    .catch(error=>{console.log(error)})
  }

  const spotifyTracks = () => {
    var spotify = new SpotifyWebApi();
    spotify.setAccessToken(token)
    spotify.getTracks(starterSongs)
    .then(data=>{
      setTracks(data['tracks'])
    })
    .catch(error=>{console.log(error)})
  }

  useEffect(() => {
    spotifyTracks()
    spotifyAudioFeatures()
    spotifyPlaylists()
    Bubble(tracks)
  })
    return (
      <div>
        <p>Loading Data</p>
      </div>
      
    );
};

export default SpotifyFetch;

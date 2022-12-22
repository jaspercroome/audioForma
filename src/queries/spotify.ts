import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../static/constants";

const headers = new Headers({
  Authorization: "Basic " + SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET,
});

export const requestAuthToken = async () => {
  if (typeof localStorage !== "undefined") {
    if (localStorage.getItem("spotifyAuthToken")) {
      return JSON.parse(localStorage.getItem("spotifyAuthToken") ?? "");
    } else {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body:
          "grant_type=client_credentials&client_id=" +
          SPOTIFY_CLIENT_ID +
          "&client_secret=" +
          SPOTIFY_CLIENT_SECRET,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const token = await response.json();
      if (response.ok) {
        localStorage.setItem("spotifyAuthToken", JSON.stringify(token));
      }
      return token;
    }
  }
};

export const getSpotifyTracks = async () => {
  const authToken = requestAuthToken;

  const response = await fetch("https://api.spotify.com/V1/me/tracks", {
    method: "GET",
  });
};

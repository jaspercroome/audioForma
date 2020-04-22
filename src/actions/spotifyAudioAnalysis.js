import SpotifyWebApi from "spotify-web-api-js";

export const getAa = async (id, token) => {
  let spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  try {
    const tempData = await spotify.getAudioAnalysisForTrack(id);
    return tempData;
  } catch (error) {
    console.log(error);
  }
};

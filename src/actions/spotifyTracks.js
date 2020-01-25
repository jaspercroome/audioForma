import SpotifyWebApi from "spotify-web-api-js";

export const getTracks = async creds => {
  const token = await creds;
  console.log(token);
  let newTracks = [];
  let newAudioFeatures = [];
  let newArtists = [];
  let spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);
  try {
    const limit = 50;
    let offset = 0;
    let total = 51;
    let afData = [];
    let artistData = [];
    while (offset < total) {
      let artistIds = [];
      let trackIds = [];
      const data = await spotify.getMySavedTracks({
        limit: limit,
        offset: offset
      });
      total = data["total"];
      for (let track of data["items"]) {
        newTracks.push(track["track"]);
        trackIds.push(track["track"]["id"]);
        artistIds.push(track["track"]["artists"][0]["id"]);
      }

      const afTempData = await spotify.getAudioFeaturesForTracks(trackIds);
      for (let af of afTempData["audio_features"]) {
        newAudioFeatures.push(af);
      }

      const artistTempData = await spotify.getArtists(artistIds);
      for (let artist of artistTempData["artists"]) {
        newArtists.push(artist);
      }

      offset += 50;
    }
    console.log(newTracks, newAudioFeatures, newArtists);

    const trackMerge = (arr1, arr2) => {
      const temp = [];

      arr1.forEach(x => {
        arr2.forEach(y => {
          if (x["id"] === y["id"]) {
            temp.push({ ...x, ...y });
          }
        });
      });

      return temp;
    };

    const artistMerge = (arr1, arr2) => {
      const temp = [];

      arr1.forEach(x => {
        arr2.forEach(y => {
          if (x["artists"][0]["id"] === y["id"]) {
            temp.push({ ...x, ...y });
          }
        });
      });

      return temp;
    };
    let uniq = {};

    const finalArtists = newArtists.filter(
      obj => !uniq[obj.id] && (uniq[obj.id] = true)
    );

    const trackData = trackMerge(newTracks, newAudioFeatures);

    const allData = artistMerge(trackData, finalArtists);

    console.log(allData);

    return trackData;
  } catch (error) {
    console.log(error);
  }
};

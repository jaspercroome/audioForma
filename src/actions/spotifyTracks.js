import SpotifyWebApi from "spotify-web-api-js";
import { getBaseTracks, pushBaseTracks } from "../base";
import chunk from "../helpers";

export const getTracks = async (creds, publicFlag) => {
  const token = await creds;
  const isPublic = await publicFlag;

  let newTracks = [];
  let newAudioFeatures = [];
  let newArtists = [];

  const publicTrackIds = await getBaseTracks();

  let spotify = new SpotifyWebApi();
  spotify.setAccessToken(token);

  try {
    let chunkOffset = 0;
    let offset = 0;
    const limit = 50;
    let total = 51;

    const chunkedPublicTrackIds = chunk(publicTrackIds, limit);

    while (offset < total) {
      let artistIds = [];
      let myTrackIds = [];
      const tempPublicTrackIds = chunkedPublicTrackIds[chunkOffset];
      const data =
        (await isPublic) === true
          ? await spotify.getTracks(tempPublicTrackIds)
          : await spotify.getMySavedTracks({
              limit: limit,
              offset: offset
            });

      total = data["total"] || publicTrackIds.length;

      if (isPublic === true) {
        for (let track of data["tracks"]) {
          newTracks.push(track);
          myTrackIds.push(track["id"]);
          artistIds.push(track["artists"][0]["id"]);
        }
      } else {
        for (let track of data["items"]) {
          newTracks.push(track["track"]);
          myTrackIds.push(track["track"]["id"]);
          artistIds.push(track["track"]["artists"][0]["id"]);
        }
      }

      const tempTrackIds = isPublic ? tempPublicTrackIds : myTrackIds;

      const afData = await spotify.getAudioFeaturesForTracks(tempTrackIds);
      for (let af of afData["audio_features"]) {
        newAudioFeatures.push(af);
      }

      const artistData = await spotify.getArtists(artistIds);
      for (let artist of artistData["artists"]) {
        newArtists.push(artist);
      }

      offset += 50;
    }

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

    pushBaseTracks(trackData);

    return trackData;
  } catch (error) {
    console.log(error);
  }
};

import SpotifyWebApi from "spotify-web-api-js";
import _ from "lodash";
import {
  getBaseTrackData,
  getBaseTrackIds,
  pushBaseTrackIds,
  pushBaseTrackData
} from "../base";
import { chunk, unique } from "../helpers";

export const getPublicTracks = async () => {
  const tracks = [];
  let rawData = await getBaseTrackData();
  for (let item of rawData) {
    // if item in array is array
    if (item.length) {
      for (let track of item) {
        // push items from array into tracks
        tracks.push(track);
      }
    }
  }
  const allPublicTracks = unique(tracks, ["trackData"], ["id"]);
  const finalPublicTracks = _.sampleSize(allPublicTracks, 1000);
  console.log(finalPublicTracks);
  return finalPublicTracks;
};

export const getTracks = async (creds, publicFlag) => {
  const token = await creds;
  const isPublic = publicFlag;

  let newTracks = [];
  let newAudioFeatures = [];
  let newArtists = [];
  let trackIds = [];

  const publicTrackIds = await getBaseTrackIds();

  console.log(`${publicTrackIds.length} total songs queried`);

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
      for (let t of tempTrackIds) {
        trackIds.push(t);
      }

      offset += 50;
      chunkOffset += 1;
    }

    for (let p of publicTrackIds) {
      trackIds.push(p);
    }
    const finalTrackIds = Array.from(new Set(trackIds));

    !isPublic
      ? pushBaseTrackIds(finalTrackIds)
      : console.log("nothing new to add");

    let uniq = {};

    const finalArtists = newArtists.filter(
      obj => !uniq[obj.id] && (uniq[obj.id] = true)
    );

    const trackMerge = (arr1, arr2) => {
      const temp = [];
      const a1 = _.compact(arr1);
      const a2 = _.compact(arr2);

      a1.forEach(x => {
        a2.forEach(y => {
          if (x["id"] === y["id"]) {
            const trackData = { ...x };
            const afData = { ...y };
            temp.push({ trackData, afData });
          }
        });
      });

      return temp;
    };

    const artistMerge = (arr1, arr2) => {
      const temp = [];

      arr1.forEach(x => {
        arr2.forEach(y => {
          const artistData = { ...y };
          if (x["trackData"]["artists"][0]["id"] === y["id"]) {
            temp.push({ ...x, artistData });
          }
        });
      });

      return temp;
    };

    const trackData = trackMerge(newTracks, newAudioFeatures);

    const allData = artistMerge(trackData, finalArtists);

    console.log(allData);

    return allData;
  } catch (error) {
    console.log(error);
  }
};

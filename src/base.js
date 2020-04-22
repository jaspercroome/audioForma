import Rebase from "re-base";
import firebase from "firebase/app";
import "firebase/database";

import { chunk } from "./helpers";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA01e04vhDOKkT_29DE7Q4AoYKj51Ox-mw",
  authDomain: "audioforma.firebaseapp.com",
  databaseURL: "https://audioforma.firebaseio.com"
});
const base = Rebase.createClass(firebaseApp.database());

const getBaseTrackIds = async () =>
  await base
    .fetch("publicTrackIds", {
      context: this,
      asArray: true
    })
    .then(data => {
      return data;
    });

const getBaseTrackData = async () =>
  await base
    .fetch("allTrackData", {
      context: this,
      asArray: true
    })
    .then(data => {
      return data;
    });

const pushBaseTrackIds = trackIds => {
  base.post("publicTrackIds", { data: trackIds });
};

const pushBaseTrackData = trackData => {
  const dataArray = chunk(trackData, 1000);
  for (let trackData of dataArray) {
    base.push("allTrackData", { data: trackData });
    console.log("pushing", trackData);
  }
};

export {
  firebaseApp,
  pushBaseTrackIds,
  pushBaseTrackData,
  getBaseTrackIds,
  getBaseTrackData
};

export default base;

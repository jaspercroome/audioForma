import Rebase from "re-base";
import firebase from "firebase/app";
import "firebase/database";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA01e04vhDOKkT_29DE7Q4AoYKj51Ox-mw",
  authDomain: "audioforma.firebaseapp.com",
  databaseURL: "https://audioforma.firebaseio.com"
});
const base = Rebase.createClass(firebaseApp.database());

const getBaseTracks = async () =>
  await base
    .fetch("publicTrackIds", {
      context: this,
      asArray: true
    })
    .then(data => {
      return data;
    });

const pushBaseTrackIds = tracks => {
  base.post("publicTrackIds", { data: tracks });
};

export { firebaseApp, pushBaseTrackIds, getBaseTracks };

export default base;

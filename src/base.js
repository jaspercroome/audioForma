import Rebase from "re-base";
import firebase from "firebase/app";
import "firebase/database";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA01e04vhDOKkT_29DE7Q4AoYKj51Ox-mw",
  authDomain: "audioforma.firebaseapp.com",
  databaseURL: "https://audioforma.firebaseio.com"
});
const base = Rebase.createClass(firebaseApp.database());

const getBaseTracks = () =>
  base
    .fetch("songs", {
      context: this,
      asArray: true
    })
    .then(data => {
      return data;
    });

const pushBaseTracks = tracks => {
  base.push("songs", { data: tracks });
};

export { firebaseApp, pushBaseTracks, getBaseTracks };

export default base;

import React, { useContext } from "react";

import { spotifyTracks } from "../actions";

const TrackContext = React.createContext();

const initialState = {
  status: "loading",
  tracks: []
};

const reducer = state => {
  return initialState;
};

const Provider = ({ children }) => {
  const [dispatch, state] = React.useReducer(reducer, initialState);
  let value = {
    tracks: state.tracks,
    status: state.status
  };
  spotifyTracks.getPublicTracks().then(data => {
    value.tracks = data;
  });
  return (
    <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
  );
};

const DataContext = () => {
  return (
    <Provider>
      <Text />
    </Provider>
  );
};

const Text = () => {
  const tracks = useContext(TrackContext);
  console.log(tracks);
  return (
    <div>
      <p>child!</p>
    </div>
  );
};

export default DataContext;
export { TrackContext };

import React from "react";
import { useContext } from "react";

import { TrackContext } from "../context/DataContext";

const Text = () => {
  const tracks = useContext(TrackContext);
  console.log(tracks["tracks"]);
  return (
    <div>
      <p>child!</p>
    </div>
  );
};
export default Text;

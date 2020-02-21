import React from "react";
import { useContext } from "react";

import { TrackContext } from "../DataContext";

const Text = () => {
  const tracks = useContext(TrackContext);
  console.log(tracks);
  return (
    <div>
      <p>child!</p>
    </div>
  );
};
export default Text;

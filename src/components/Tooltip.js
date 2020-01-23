import React, { useState, useEffect } from "react";
import { Text } from "@vx/text";

export const Tooltip = props => {
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const [primaryArtist, setPrimaryArtist] = useState(props.primaryArtist);
  const [songTitle, setSongTitle] = useState(props.songTitle);
  const [opacity, setOpacity] = useState(props.opacity);

  useEffect(() => {
    setX(props.x);
    setY(props.y);
    setPrimaryArtist(props.primaryArtist);
    setSongTitle(props.songTitle);
    setOpacity(props.opacity);
  }, [props]);

  return (
    <Text
      y={y}
      x={x}
      opacity={opacity}
      textAnchor={"middle"}
      style={{ fontSize: "1.5vw" }}
    >
      {primaryArtist + " | " + songTitle}
    </Text>
  );
};

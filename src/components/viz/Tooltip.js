import React, { useState, useEffect } from "react";
import { Text } from "@vx/text";
import { Detail } from "./detail";

export const Tooltip = props => {
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const [id, setId] = useState(props.id);
  const [primaryArtist, setPrimaryArtist] = useState(props.primaryArtist);
  const [songTitle, setSongTitle] = useState(props.songTitle);
  const [opacity, setOpacity] = useState(props.opacity);

  useEffect(() => {
    setX(props.x);
    setY(props.y);
    setId(props.id);
    setPrimaryArtist(props.primaryArtist);
    setSongTitle(props.songTitle);
    setOpacity(props.opacity);
  }, [props]);

  return (
    <React.Fragment>
      <Text
        y={y}
        x={x}
        opacity={opacity}
        textAnchor={"middle"}
        style={{ fontSize: "4vw" }}
      >
        {primaryArtist + " | " + songTitle}
        <Detail id={id} />
      </Text>
    </React.Fragment>
  );
};

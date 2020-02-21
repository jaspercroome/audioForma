import React, { useState } from "react";

import { spotifyTracks } from "../actions";

import { GroupFormControl } from "./controls";

const DataSpace = props => {
  const token = window.location.hash.split("=", 2)[1].split("&", 1)[0];
  const isPublic =
    window.location.hash.split("=", 2)[1].split("&", 2)[1] === "public"
      ? true
      : false;

  const defaultGroupBy = isPublic ? "artist" : "track";

  // setting state for hooks
  const [d3Status, setD3Status] = useState("Not Started");
  const [tracks, setTracks] = useState([]);
  const [sortBy, setSortBy] = useState("valence");
  const [sortByDomain, setSortByDomain] = useState([0, 1]);
  const [groupBy, setGroupBy] = useState(defaultGroupBy);

  isPublic
    ? spotifyTracks.getPublicTracks().then(tracks => {
        setD3Status("pending");
        setTracks(tracks);
        setD3Status("completed");
      })
    : spotifyTracks.getTracks(token, isPublic).then(tracks => {
        setTracks(tracks);
        setD3Status("completed");
      });

  const handleGroupByChange = groupBy => {
    setGroupBy(groupBy);
  };

  return (
    <div>
      <p>{d3Status}</p>
      <p>{isPublic ? "public" : "private"}</p>
      <p> {groupBy} </p>
      {/* <GroupFormControl
        groupBy={groupBy}
        handleGroupByChange={handleGroupByChange}
      /> */}
    </div>
  );
};
export default DataSpace;

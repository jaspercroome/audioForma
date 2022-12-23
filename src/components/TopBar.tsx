import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React, { CSSProperties } from "react";

interface TopBarProps {
  availableArtists: string[];
  handleChange: (arg0?: string | null) => void;
}

const topBarContainerStyle:CSSProperties = {
  position: "absolute",
  height: "fit-content",
  paddingTop: "10px",
  paddingBottom: "10px",
  top: "0px",
  left: "0px",
  width: "100vw",
  borderBottom: "3px solid black",
  background: "#fff",
  display: "flex",
  flex: "row",
  justifyContent: "start",
  zIndex: 100,
}

export const TopBar = (props: TopBarProps) => {
  const { availableArtists, handleChange } = props;
  return (
    <div
      style={topBarContainerStyle}
    >
      <div style={{width:'25vw', display:'flex', paddingLeft:'4vw', alignItems:'center'}}>
      <Typography variant="h2">aF</Typography>
      </div>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={availableArtists}
        style={{ color: "#777", width: "50vw" }}
        multiple={false}
        onChange={(e, value) => handleChange(value)}
        renderInput={(params) => (
          <TextField {...params} label="Select an Artist" />
        )}
      />
    </div>
  );
};

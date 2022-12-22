import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React from "react";

interface TopBarProps {
  availableArtists: string[];
  handleChange: (arg0?: string | null) => void;
}

export const TopBar = (props: TopBarProps) => {
  const { availableArtists, handleChange } = props;
  return (
    <div
      style={{
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
      }}
    >
      <div style={{width:'25vw', display:'flex', paddingLeft:'32px', alignItems:'center'}}>
      <Typography variant="h2">Audioforma</Typography>
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

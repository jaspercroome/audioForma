import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { SongJSON } from "../static/songs";

type SideBarProps = {
  availableArtists: string[];
  filteredArtist?: string;
  setFilteredArtist: (arg0?: string) => void;
  showX: boolean;
  showY: boolean;
  showZ: boolean;
  setShowX: (arg0: boolean) => void;
  setShowY: (arg0: boolean) => void;
  setShowZ: (arg0: boolean) => void;
  showDividers: boolean;
  setShowDividers: (arg0: boolean) => void;
  showGridHelpers: boolean;
  setShowGridHelpers: (arg0: boolean) => void;
  open: boolean;
  onClose: (arg0?: unknown) => void;
  songHistory: Array<SongJSON[string]>;
  onClickListItem: (arg0: SongJSON[string]) => void;
  onClickTab:(arg0?:unknown)=> void;
};

export const SideBar = (props: SideBarProps) => {
  const {
    availableArtists,
    open,
    onClose,
    filteredArtist,
    setFilteredArtist,
    showDividers,
    setShowDividers,
    setShowGridHelpers,
    setShowX,
    setShowY,
    setShowZ,
    showGridHelpers,
    showX,
    showY,
    showZ,
    onClickListItem,
    songHistory,
    onClickTab,
  } = props;

  const dotStyle: React.CSSProperties = {
    position: "relative",
    top: "15px",
    left: "3px",
    height: "6px",
    width: "6px",
    border: "3px black solid",
    borderRadius: "3px",
    background: "black",
    marginBottom: "5px",
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        style={{ width: "200px" }}
        transitionDuration={{ appear: 200, enter: 200, exit: 200 }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={availableArtists}
          style={{ color: "#777" }}
          multiple={false}
          onChange={(e, value) => {
            if (value) setFilteredArtist(value);
            else {
              setFilteredArtist(undefined);
            }
            setShowX(true);
            setShowY(true);
            setShowZ(true);
          }}
          value={filteredArtist}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Select an Artist" />
          )}
        />
        <FormGroup>
          <FormControlLabel
            label="Measure Danceability"
            style={{ color: "#777" }}
            control={
              <Switch
                defaultChecked
                color="default"
                value={showX}
                onChange={() => {
                  setShowX(!showX);
                }}
              />
            }
          />
          <FormControlLabel
            label="Measure Happiness"
            style={{ color: "#777" }}
            control={
              <Switch
                defaultChecked
                color="default"
                value={showY}
                onChange={() => {
                  setShowY(!showY);
                }}
              />
            }
          />
          <FormControlLabel
            label="Measure Energy"
            style={{ color: "#777" }}
            control={
              <Switch
                defaultChecked
                color="default"
                value={showZ}
                onChange={() => {
                  setShowZ(!showZ);
                }}
              />
            }
          />
          <FormControlLabel
            label="Show Dividers"
            style={{ color: "#777" }}
            control={
              <Switch
                color="default"
                value={showDividers}
                onChange={() => {
                  setShowDividers(!showDividers);
                }}
              />
            }
          />
          <FormControlLabel
            label="Show Grids"
            style={{ color: "#777" }}
            control={
              <Switch
                color="default"
                value={showGridHelpers}
                onChange={() => {
                  setShowGridHelpers(!showGridHelpers);
                }}
              />
            }
          />
        </FormGroup>
        <Typography variant="h6">Song History</Typography>
        <List>
          {songHistory.map((song) => (
            <ListItem
              style={{ cursor: "pointer" }}
              key={song.id}
              onClick={() => onClickListItem(song)}
            >{`${song.name} - ${song.artists[0].name}`}</ListItem>
          ))}
        </List>
      </Drawer>

      <div
        style={{
          position: "absolute",
          top: "calc(50vh - 60px)",
          left: open ? '217px': "-3px",
          height: "60px",
          width: "20px",
          borderRadius: "0px 10px 10px 0px",
          border: "3px black solid",
          cursor: "pointer",
          backgroundColor: "white",
          transition: "transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;"
        }}
        onClick={onClickTab}
      >
        <div style={dotStyle} />
        <div style={dotStyle} />
        <div style={dotStyle} />
      </div>
    </>
  );
};

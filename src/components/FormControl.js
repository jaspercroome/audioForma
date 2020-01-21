import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// https://material-ui.com/components/selects/

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function SimpleSelect(props) {
  const classes = useStyles();
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  const [sortBy, setSortBy] = useState(props.sortBy);
  const { handleSortByChange } = props;

  useEffect(() => {
    setLabelWidth(inputLabel.offsetWidth);
  }, []);

  useEffect(() => {
    handleSortByChange(sortBy);
  }, [sortBy, handleSortByChange]);

  const handleChange = event => {
    setSortBy(event.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-helper-label">Sort By</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={sortBy}
        onChange={handleChange}
      >
        <MenuItem value={"valence"}>Happiness</MenuItem>
        <MenuItem value={"danceability"}>Danceability</MenuItem>
        <MenuItem value={"energy"}>Energy</MenuItem>
        <MenuItem value={"speechiness"}>Speechiness</MenuItem>
        <MenuItem value={"instrumentalness"}>Instrumentalness</MenuItem>
        <MenuItem value={"liveness"}>Liveness</MenuItem>
      </Select>
      <FormHelperText>Choose how to sort your songs</FormHelperText>
    </FormControl>
  );
}

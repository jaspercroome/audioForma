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

  const [groupBy, setGroupBy] = useState(props.groupBy);
  const { handleGroupByChange } = props;

  useEffect(() => {
    setLabelWidth(inputLabel.offsetWidth);
  }, []);

  useEffect(() => {
    handleGroupByChange(groupBy);
  }, [groupBy, handleGroupByChange]);

  const handleChange = event => {
    setGroupBy(event.target.value);
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-helper-label">Group By</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={groupBy}
        onChange={handleChange}
      >
        <MenuItem value={"track"}>Track</MenuItem>
        <MenuItem value={"artist"}>Artist</MenuItem>
        <MenuItem value={"album"}>Album</MenuItem>
        <MenuItem value={"genre"}>Genre</MenuItem>
      </Select>
      <FormHelperText>
        Choose how to <b>group</b> your songs
      </FormHelperText>
    </FormControl>
  );
}

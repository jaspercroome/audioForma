import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import { Detail } from "./detail";
import { createElement } from "react";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

const AudioSample = props => {
  const modal = props["modal"];
  const { handleModalChange } = props;

  const artist = modal["artist"];
  const trackName = modal["title"];
  const id = modal["id"];
  const token = modal["token"];
  const url = modal["url"] && modal["url"].split("?", 1)[0] + ".mp3";
  const previewId = modal["url"] && modal["url"].split("/", 5)[4].split("?", 1)[0]
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const handleChange = async event => {
    handleModalChange(event, {
      modalData: {
        primaryArtist: null,
        songTitle: null,
        url: null
      }
    });
  };

  return (
    <Modal
      disableEnforceFocus
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props["modal"]["open"]}
      onClose={handleChange}
    >
      <div style={modalStyle} className={classes.paper}>
        {url ? (
          <Fragment>
            <h2>{trackName + " | " + artist}</h2>
            <Detail previewId={previewId} />
            <audio controls autoPlay name={trackName + " | " + artist}>
              <source src={url} type="audio/mpeg" />
            </audio>
          </Fragment>
        ) : (
            <p>Bummer! No audio sample available.</p>
          )}
      </div>
    </Modal>
  );
};
export default AudioSample;

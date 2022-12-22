const axios = require("axios");

import { csvParse } from "d3-dsv";

export interface RawAfResponseData {
  "MIDI Note": string;
  octave: string;
  note_name: string;
  Viz_Angle: string;
  circle_fifths_X: string;
  circle_fifths_Y: string;
  note_time: string;
  magnitude: string;
}

export const afMicroServicePost = async (previewId: string) => {
  const id = previewId;
  try {
    const tempData = await axios.post(
      "https://af-microservice.herokuapp.com/",
      {
        songUrlId: id,
      }
    );
    return tempData as { data: string[] };
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
};
export const afMicroServiceGet = async () => {
  try {
    const poke = await axios.get("https://af-microservice.herokuapp.com/");
    console.log(poke.data);
  } catch (error) {
    console.log(error);
  }
};

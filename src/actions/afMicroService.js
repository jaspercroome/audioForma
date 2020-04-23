//App
//-Bubble
//--AudioSample
//---Detail
//*----afMicroService

import axios from "axios";
import { csvParse } from "d3-dsv";

export const afMicroServicePost = async (previewId) => {
  const id = previewId;
  try {
    const tempData = await axios.post(
      "https://af-microservice.herokuapp.com/",
      {
        songUrlId: id,
      }
    );
    return csvParse(tempData.data);
  } catch (error) {
    console.log(error);
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

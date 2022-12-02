import axios from "axios";
import { csvParse } from "d3-dsv";

export const afMicroServicePost = async (previewId: string) => {
  const id = previewId;
  try {
    const tempData = fetch("https://af-microservice.herokuapp.com/", {
      method: "POST",
      body: JSON.stringify({
        songUrlId: id,
      }),
    });

    return await tempData;
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

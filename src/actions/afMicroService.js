import axios from "axios"

export const afMicroService = async (previewId) => {
  const id = previewId
  try {
    const tempData = await axios.post('https://af-microservice.herokuapp.com/', {
      "songUrlId": id
    })
    console.log(tempData.data)
    return tempData;
  } catch (error) {
    console.log(error);
  }
};

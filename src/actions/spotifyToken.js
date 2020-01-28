import request from "request";

export const GetToken = async store => {
  const client_id = process.env.REACT_APP_spotifyKey;
  const client_secret = process.env.REACT_APP_spotifySecretKey;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    form: {
      grant_type: "client_credentials"
    },
    json: true
  };

  async function response() {
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        return body.response;
      }
    });
  }
  let accessToken = await response["response"];
  return accessToken;
};

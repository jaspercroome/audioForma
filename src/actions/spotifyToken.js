export const spotifyToken = store => {
  const newToken = window.location.hash
    ? window.location.hash.split("=", 2)[1].split("&", 1)[0]
    : "";
  store.setState({ token: newToken });
};

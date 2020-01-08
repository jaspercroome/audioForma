export const spotifyToken = async store => {
  const newToken = window.location.hash
    ? window.location.hash.split("=", 2)[1].split("&", 1)[0]
    : "";
  const setToken = () => {
    store.setState({ token: newToken });
  };
  setToken();
};

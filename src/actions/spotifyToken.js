export const getToken = async store => {
  const token = window.location.hash.split("=", 2)[1].split("&", 1)[0];
  try {
    store.setState({ token });
  } catch (error) {
    console.log(error);
  }
};

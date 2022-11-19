import { useQuery } from "react-query";

export const useSpotifyAuthQuery = useQuery("requestAuth", () => {
  fetch("https://accounts.spotify.com/authorize?");
});

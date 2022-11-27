export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
export const noteLocations: {
  note: string;
  angle: number;
  x: number;
  y: number;
}[] = [
  { note: "C", angle: 0, x: 0, y: 1 },
  { note: "C#", angle: 210, x: -0.5, y: -0.8660254038 },
  { note: "D", angle: 60, x: 0.8660254038, y: 0.5 },
  { note: "D#", angle: 270, x: -1, y: 0 },
  { note: "E", angle: 120, x: 0.8660254038, y: -0.5 },
  { note: "F", angle: 330, x: -0.5, y: 0.8660254038 },
  { note: "F#", angle: 180, x: 0, y: -1 },
  { note: "G", angle: 30, x: 0.5, y: 0.8660254038 },
  { note: "G#", angle: 240, x: -0.8660254038, y: -0.5 },
  { note: "A", angle: 90, x: 1, y: 0 },
  { note: "A#", angle: 300, x: -0.8660254038, y: 0.5 },
  { note: "B", angle: 150, x: 0.5, y: -0.8660254038 },
];

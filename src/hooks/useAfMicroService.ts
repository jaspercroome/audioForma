import { useQuery, UseQueryResult } from "react-query";
import { afMicroServicePost } from "../queries/afMicroService";
import { octaves } from "../static/constants";

type RawAFData = string[];

export type FormattedAFData = {
  "MIDI Note": string;
  note_name: string;
  octave: number;
  circle_Fifths_X: number;
  circle_Fifths_Y: number;
  "Viz angle": number;
  note_time: number;
  magnitude: number;
}[];

export const useAfMicroServicePost = (previewUrlId: string) => {
  const key = ["getAFDetails", previewUrlId];
  const result = useQuery(key, () => afMicroServicePost(previewUrlId), {
    select: (data) => {
      const allData = data.data.map((d) => JSON.parse(d)) as FormattedAFData[];
      const structuredData = allData.map((datum) => {
        return {
          time: datum[0].note_time,
          notes: octaves.map((octave) => {
            return datum.filter((d) => {
              return d.octave === octave;
            });
          }),
        };
      });
      return structuredData;
    },
    enabled: true,
  });

  return result;
};

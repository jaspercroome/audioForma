import { useEffect, useState, useRef } from "react";
import Meyda, { MeydaAudioFeature, MeydaFeaturesObject } from "meyda";
import { isEqual } from "lodash";

type MeydaConfig = {
  audioContext?: AudioContext | null;
  source?: AudioNode | null;
  bufferSize?: number;
  featureExtractors?: MeydaAudioFeature[];
};

export const useMeydaAnalyzer = (config: MeydaConfig) => {
  const [analyzer, setAnalyzer] = useState<Meyda.MeydaAnalyzer>();
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [source, setSource] = useState<AudioNode>();
  const [features, setFeatures] = useState<Meyda.MeydaFeaturesObject>();
  const featuresRef = useRef(features);
  useEffect(() => {
    if (source && audioContext && !analyzer) {
      console.info("initializing analyzer", { audioContext, source, analyzer });
      const newAnalyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: config.bufferSize || 512,
        featureExtractors: config.featureExtractors || ["rms"],
        callback: (nextFeatures: MeydaFeaturesObject) => {
          const currFeatures = featuresRef.current;
          if (!isEqual(currFeatures, nextFeatures)) {
            setFeatures(nextFeatures);
          }
        },
      });
      source.connect(audioContext.destination);
      setAnalyzer(newAnalyzer);
    }
  }, [source]);
  useEffect(() => {
    if (analyzer) analyzer.start();
  }, [analyzer]);
  useEffect(() => {
    featuresRef.current = features;
  }, [features]);
  return {
    analyzer,
    features,
    setAudioContext,
    setSource,
  };
};

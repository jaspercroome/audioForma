import { useEffect, useState, useRef } from "react";
import Meyda from "meyda";
import { isEqual } from "lodash";

type MeydaConfig = {
  audioContext?: AudioContext;
  source?: any;
  bufferSize?: number;
  featureExtractors?: string[];
};

export const useMeydaAnalyzer = (config: MeydaConfig) => {
  const [analyzer, setAnalyzer] = useState<Meyda.MeydaAnalyzer>();
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [source, setSource] = useState<AudioNode>();
  const [features, setFeatures] = useState<Meyda.MeydaAudioFeature[]>();
  const featuresRef = useRef(features);
  useEffect(() => {
    if (source && audioContext && !analyzer) {
      console.info("initializing analyzer", { audioContext, source, analyzer });
      const newAnalyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: config.bufferSize || 512,
        featureExtractors: config.featureExtractors || ["rms"],
        callback: (nextFeatures) => {
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

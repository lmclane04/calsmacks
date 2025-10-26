import { useEffect, useRef, useState } from 'react';

interface AudioMixerOptions {
  narrationUrl: string;
  backgroundMusicUrl?: string;
  narrationVolume?: number;
  musicVolume?: number;
}

export function useAudioMixer({
  narrationUrl,
  backgroundMusicUrl,
  narrationVolume = 1.0,
  musicVolume = 0.3,
}: AudioMixerOptions) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const narrationSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const narrationGainRef = useRef<GainNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize Web Audio API context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      // Cleanup
      if (narrationSourceRef.current) {
        narrationSourceRef.current.stop();
      }
      if (musicSourceRef.current) {
        musicSourceRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (narrationGainRef.current) {
      narrationGainRef.current.gain.value = narrationVolume;
    }
  }, [narrationVolume]);

  useEffect(() => {
    if (musicGainRef.current) {
      musicGainRef.current.gain.value = musicVolume;
    }
  }, [musicVolume]);

  const loadAudioBuffer = async (url: string): Promise<AudioBuffer> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioContextRef.current!.decodeAudioData(arrayBuffer);
  };

  const playMixedAudio = async () => {
    if (!audioContextRef.current) return;

    setIsLoading(true);
    try {
      const ctx = audioContextRef.current;

      // Stop any existing playback
      if (narrationSourceRef.current) {
        narrationSourceRef.current.stop();
      }
      if (musicSourceRef.current) {
        musicSourceRef.current.stop();
      }

      // Create gain nodes for volume control
      narrationGainRef.current = ctx.createGain();
      narrationGainRef.current.gain.value = narrationVolume;

      if (backgroundMusicUrl) {
        musicGainRef.current = ctx.createGain();
        musicGainRef.current.gain.value = musicVolume;
      }

      // Load and play narration
      const narrationBuffer = await loadAudioBuffer(narrationUrl);
      narrationSourceRef.current = ctx.createBufferSource();
      narrationSourceRef.current.buffer = narrationBuffer;
      narrationSourceRef.current.connect(narrationGainRef.current);
      narrationGainRef.current.connect(ctx.destination);

      // Load and play background music if provided
      if (backgroundMusicUrl && musicGainRef.current) {
        const musicBuffer = await loadAudioBuffer(backgroundMusicUrl);
        musicSourceRef.current = ctx.createBufferSource();
        musicSourceRef.current.buffer = musicBuffer;
        musicSourceRef.current.loop = true; // Loop background music
        musicSourceRef.current.connect(musicGainRef.current);
        musicGainRef.current.connect(ctx.destination);
        musicSourceRef.current.start(0);
      }

      // Start narration
      narrationSourceRef.current.start(0);
      setIsPlaying(true);

      // Stop music when narration ends
      narrationSourceRef.current.onended = () => {
        setIsPlaying(false);
        if (musicSourceRef.current) {
          musicSourceRef.current.stop();
        }
      };
    } catch (error) {
      console.error('Error playing mixed audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stop = () => {
    if (narrationSourceRef.current) {
      narrationSourceRef.current.stop();
    }
    if (musicSourceRef.current) {
      musicSourceRef.current.stop();
    }
    setIsPlaying(false);
  };

  return {
    playMixedAudio,
    stop,
    isPlaying,
    isLoading,
  };
}

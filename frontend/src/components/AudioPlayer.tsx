import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerProps {
  narrationUrl: string;
  backgroundMusicUrl?: string;
}

export default function AudioPlayer({ narrationUrl, backgroundMusicUrl }: AudioPlayerProps) {
  const narrationRef = useRef<HTMLAudioElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const [narrationVolume, setNarrationVolume] = useState(1.0);
  const [musicVolume, setMusicVolume] = useState(0.3); // Lower volume for background
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  useEffect(() => {
    if (narrationRef.current) {
      narrationRef.current.volume = narrationVolume;
    }
  }, [narrationVolume]);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
    if (musicRef.current) {
      if (isMusicEnabled) {
        musicRef.current.pause();
      } else {
        musicRef.current.play();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Narration Audio */}
      <div className="p-4 bg-black/50 backdrop-blur-md rounded-lg border border-purple-500/30">
        <div className="flex items-center space-x-3 mb-2">
          <Volume2 className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-gray-300">Narration</span>
        </div>
        <audio
          ref={narrationRef}
          key={narrationUrl}
          src={narrationUrl}
          controls
          autoPlay
          className="w-full"
        />
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-xs text-gray-400">Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={narrationVolume}
            onChange={(e) => setNarrationVolume(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-400">{Math.round(narrationVolume * 100)}%</span>
        </div>
      </div>

      {/* Background Music */}
      {backgroundMusicUrl && (
        <div className="p-4 bg-black/50 backdrop-blur-md rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Music className="w-5 h-5 text-pink-400" />
              <span className="text-sm text-gray-300">Background Music</span>
            </div>
            <button
              onClick={toggleMusic}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isMusicEnabled ? (
                <Volume2 className="w-4 h-4 text-pink-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          <audio
            ref={musicRef}
            src={backgroundMusicUrl}
            loop
            autoPlay={isMusicEnabled}
            className="w-full"
          />
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-gray-400">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!isMusicEnabled}
            />
            <span className="text-xs text-gray-400">{Math.round(musicVolume * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

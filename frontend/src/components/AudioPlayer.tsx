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
    <div className="flex flex-col md:flex-row gap-2">
      {/* Narration Audio - Compact version */}
      <div className="p-2 bg-black/70 backdrop-blur-md rounded-lg border border-purple-500/30 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-300">Narration</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={narrationVolume}
            onChange={(e) => setNarrationVolume(parseFloat(e.target.value))}
            className="w-16"
          />
        </div>
        <audio
          ref={narrationRef}
          key={narrationUrl}
          src={narrationUrl}
          controls
          autoPlay
          className="w-full h-8 mt-1"
        />
      </div>

      {/* Background Music - Compact version */}
      {backgroundMusicUrl && (
        <div className="p-2 bg-black/70 backdrop-blur-md rounded-lg border border-purple-500/30 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-gray-300">Music</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-16"
                disabled={!isMusicEnabled}
              />
              <button
                onClick={toggleMusic}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                {isMusicEnabled ? (
                  <Volume2 className="w-4 h-4 text-pink-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <audio
            ref={musicRef}
            src={backgroundMusicUrl}
            loop
            autoPlay={isMusicEnabled}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

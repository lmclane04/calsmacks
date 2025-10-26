import { useState } from 'react';
import DreamInput from './components/DreamInput';
import SceneViewer from './components/SceneViewer';
import AudioPlayer from './components/AudioPlayer';
import { SceneConfig } from './types';

function App() {
  const [sceneConfig, setSceneConfig] = useState<SceneConfig | null>(null);
  const [narrationUrl, setNarrationUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [currentVoiceId, setCurrentVoiceId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegeneratingNarration, setIsRegeneratingNarration] = useState(false);

  const handleDreamSubmit = async (description: string, voiceId?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dream/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, voiceId })
      });

      if (!response.ok) {
        throw new Error('Failed to process dream');
      }

      const data = await response.json();
      setSceneConfig(data.sceneConfig);
      setNarrationUrl(data.narrationUrl);
      setSummary(data.summary);
      setCurrentVoiceId(voiceId);
    } catch (error) {
      console.error('Error processing dream:', error);
      alert('Failed to process dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceChange = async (newVoiceId: string) => {
    // Only regenerate if we have existing narration and the voice actually changed
    if (!summary || !narrationUrl || currentVoiceId === newVoiceId) {
      setCurrentVoiceId(newVoiceId);
      return;
    }

    setIsRegeneratingNarration(true);
    try {
      const response = await fetch('/api/audio/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary, voice: newVoiceId })
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate narration');
      }

      const data = await response.json();
      setNarrationUrl(data.audioUrl);
      setCurrentVoiceId(newVoiceId);
    } catch (error) {
      console.error('Error regenerating narration:', error);
      alert('Failed to regenerate narration with new voice. Please try again.');
    } finally {
      setIsRegeneratingNarration(false);
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* 3D Scene Background */}
      <div className="absolute inset-0">
        <SceneViewer config={sceneConfig} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="p-6 pointer-events-auto">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Dream-to-Scene
            </h1>
            <p className="text-gray-400 mt-2">Transform your dreams into immersive 3D experiences</p>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex items-end justify-center pb-8">
            <div className="w-full max-w-2xl px-6 pointer-events-auto">
              <DreamInput
                onSubmit={handleDreamSubmit}
                onVoiceChange={handleVoiceChange}
                isLoading={isLoading || isRegeneratingNarration}
              />
              
              {/* Summary Display */}
              {summary && (
                <div className="mt-4 p-4 bg-black/50 backdrop-blur-md rounded-lg border border-purple-500/30">
                  <p className="text-gray-200 italic">{summary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Audio Player with Background Music */}
          {narrationUrl && (
            <div className="p-6 pointer-events-auto">
              <AudioPlayer
                narrationUrl={narrationUrl}
                backgroundMusicUrl="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

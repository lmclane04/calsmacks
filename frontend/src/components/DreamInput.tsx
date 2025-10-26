import { useState } from 'react';
import { Mic, Send } from 'lucide-react';

interface DreamInputProps {
  onSubmit: (description: string, voiceId?: string) => void;
  isLoading: boolean;
}

// Available Fish Audio voices
// Note: Replace these placeholder IDs with actual Fish Audio voice reference IDs
// Get real voice IDs from: https://fish.audio
const VOICE_OPTIONS = [
  { id: '60aa5a7082244ff48ad20afca19f80fe', name: 'Madison' },
  { id: '3b0cf238656c4def98ecfb8fe1f6b382', name: 'Lauren' },
];

export default function DreamInput({ onSubmit, isLoading }: DreamInputProps) {
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('default');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isLoading) {
      onSubmit(description, selectedVoice);
    }
  };

  const handleVoiceInput = async () => {
    // TODO: Implement voice recording and transcription
    // For now, this is a placeholder
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording
      alert('Voice recording not yet implemented. Please type your dream description.');
    } else {
      // Stop recording and transcribe
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Voice Selector */}
      <div className="flex items-center space-x-3">
        <label htmlFor="voice-select" className="text-purple-300 text-sm font-medium">
          Narrator Voice:
        </label>
        <select
          id="voice-select"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-black/70 backdrop-blur-md border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
        >
          {VOICE_OPTIONS.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your dream... (e.g., 'I was floating in a purple sky with golden stars')"
          className="w-full p-4 pr-24 bg-black/70 backdrop-blur-md border border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
          rows={4}
          disabled={isLoading}
        />
        
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`absolute right-14 bottom-4 p-2 rounded-full transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-purple-500/20 hover:bg-purple-500/30'
          }`}
          disabled={isLoading}
        >
          <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-purple-400'}`} />
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!description.trim() || isLoading}
          className="absolute right-4 bottom-4 p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center space-x-2 text-purple-400">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2">Generating your dream scene...</span>
        </div>
      )}
    </form>
  );
}

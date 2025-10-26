import { useState, useRef } from 'react';
import { Mic, Send } from 'lucide-react';
import axios from 'axios';

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
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxRecordingDuration = 30; // seconds

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isLoading) {
      onSubmit(description, selectedVoice);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingDuration(0);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiUrl}/api/audio/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const transcribedText = response.data.text;
      // Append transcribed text to existing description
      setDescription(prev => prev ? `${prev} ${transcribedText}` : transcribedText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to transcribe audio';
      setError(errorMessage);
      console.error('Transcription error:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleVoiceInput = async () => {
    setError(null);

    if (isRecording) {
      // Stop recording
      stopRecording();
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop()); // Stop microphone access

          if (audioChunksRef.current.length > 0) {
            await transcribeAudio(audioBlob);
          }
          audioChunksRef.current = [];
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Start timer for duration display and auto-stop
        let duration = 0;
        recordingTimerRef.current = setInterval(() => {
          duration += 1;
          setRecordingDuration(duration);

          // Auto-stop at max duration
          if (duration >= maxRecordingDuration) {
            stopRecording();
          }
        }, 1000);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
        setError(errorMessage);
        console.error('Microphone access error:', err);
      }
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
          disabled={isLoading || isTranscribing}
        />

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`absolute right-14 bottom-4 p-2 rounded-full transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-purple-500/20 hover:bg-purple-500/30'
          }`}
          disabled={isLoading || isTranscribing}
          title={isRecording ? `Recording: ${recordingDuration}s / ${maxRecordingDuration}s` : 'Click to record voice input'}
        >
          <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-purple-400'}`} />
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!description.trim() || isLoading || isTranscribing}
          className="absolute right-4 bottom-4 p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 text-red-400">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">
            Recording: {recordingDuration}s / {maxRecordingDuration}s
          </span>
        </div>
      )}

      {/* Transcribing Status */}
      {isTranscribing && (
        <div className="flex items-center justify-center space-x-2 text-purple-400">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="ml-2">Transcribing your voice...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-200 hover:text-red-100 underline"
          >
            Dismiss
          </button>
        </div>
      )}

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

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import WaveAnimation from '../../components/WaveAnimation';
import { analyzeTranscript } from '../../utils/gemini';
import { saveTranscript } from '../../utils/database';

export default function RecordScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      if (Platform.OS === 'web') {
        setStatus('Recording is not available on web platform');
        return;
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setStatus('Recording...');
      setProgress(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      console.error('Recording error:', err);
      setError(errorMessage);
      setStatus('Failed to start recording');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording) return;

    setStatus('Processing...');
    setIsRecording(false);
    setError(null);
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Simulate transcription progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.1;
        setProgress(Math.min(progress, 1));
        if (progress >= 1) clearInterval(interval);
      }, 100);

      // Simulate transcription delay
      const mockTranscript = "Let's schedule a team meeting next Tuesday at 2 PM to discuss the project timeline. Action items: Update the documentation by Friday, prepare presentation slides, and send progress report to stakeholders.";
      setTranscript(mockTranscript);
      
      try {
        const analysis = await analyzeTranscript(mockTranscript);
        await saveTranscript({
          text: mockTranscript,
          analysis,
          date: new Date(),
        });
        setStatus('Analysis complete');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error analyzing transcript';
        console.error('Analysis error:', error);
        setError(errorMessage);
        setStatus('Error analyzing transcript');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop recording';
      console.error('Stop recording error:', error);
      setError(errorMessage);
      setStatus('Failed to stop recording');
    }
  }, [recording]);

  const buttonAnim = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isRecording ? 1.2 : 1) }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.transcriptContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : transcript ? (
          <Text style={styles.transcript}>{transcript}</Text>
        ) : (
          <Text style={styles.placeholder}>
            Tap the microphone button to start recording
          </Text>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.controlsContainer}>
        <Text style={styles.status}>{status}</Text>
        
        <WaveAnimation isRecording={isRecording} />
        
        <Animated.View style={[styles.recordButtonContainer, buttonAnim]}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={isRecording ? stopRecording : startRecording}>
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  transcriptContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  transcript: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1C1C1E',
  },
  placeholder: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
  },
  controlsContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  status: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
  },
  recordButtonContainer: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  recordButtonActive: {
    backgroundColor: '#FF3B30',
  },
  progressContainer: {
    height: 2,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
});



async function transcribeAudio(audioUrl) {
  const response = await fetch('https://your-project.supabase.co/functions/v1/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioUrl }),
  });
  
  const data = await response.json();
  if (response.ok) {
    return data.transcription;
  } else {
    throw new Error(data.error);
  }
}

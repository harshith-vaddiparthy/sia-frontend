import { useState, useRef } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

export const useSTT = () => {
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef(null);

  const continuousSpeechToText = (onRecognized) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      process.env.REACT_APP_AZURE_SPEECH_KEY, 
      process.env.REACT_APP_AZURE_SPEECH_REGION
    );
    
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // Increase silence timeouts for a more natural conversation pace
    recognizer.recognitionSessionOptions = {
      initialSilenceTimeoutMs: 5000, // 5 seconds before speech is considered started
      endSilenceTimeoutMs: 4000, // 3 seconds before speech is considered ended
    };

    recognizerRef.current = recognizer;

    recognizer.recognizing = (s, e) => {
      console.log(`STT: Recognizing: ${e.result.text}`);
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        console.log(`STT: Recognized: ${e.result.text}`);
        onRecognized(e.result.text);
      }
    };

    recognizer.canceled = (s, e) => {
      console.error(`STT Canceled. Reason: ${e.reason}`, e.errorDetails);
      stopListening();
    };

    recognizer.sessionStopped = (s, e) => {
      console.log("STT: Session stopped.");
      stopListening();
    };

    recognizer.startContinuousRecognitionAsync();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(() => {
        console.log("STT: Recognition stopped.");
      });
      recognizerRef.current = null;
      setIsListening(false);
    }
  };

  return { continuousSpeechToText, stopListening, isListening };
};

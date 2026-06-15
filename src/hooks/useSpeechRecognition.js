import { useState, useEffect } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let recognizer;
    if (isListening) {
      console.log('Speech recognition started');
      console.log('Using Azure Speech Key:', process.env.REACT_APP_AZURE_SPEECH_KEY);
      console.log('Using Azure Speech Region:', process.env.REACT_APP_AZURE_SPEECH_REGION);

      try {
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(process.env.REACT_APP_AZURE_SPEECH_KEY, process.env.REACT_APP_AZURE_SPEECH_REGION);
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

        console.log('SpeechConfig and AudioConfig initialized');
        console.log('SpeechConfig:', speechConfig);
        console.log('AudioConfig:', audioConfig);

        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        console.log('SpeechRecognizer initialized');

        recognizer.recognizeOnceAsync(result => {
          console.log('STT: RecognizeOnceAsync result:', result);

          if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            console.log('STT: Recognized text:', result.text);
            setTranscript(result.text);
          } else if (result.reason === SpeechSDK.ResultReason.NoMatch) {
            console.error('STT: No speech could be recognized.');
          } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
            const cancellationDetails = SpeechSDK.CancellationDetails.fromResult(result);
            console.error('STT: CancellationReason:', cancellationDetails.reason);
            console.error('STT: ErrorDetails:', cancellationDetails.errorDetails);
          } else {
            console.error('STT: Error recognizing speech:', result.errorDetails);
            if (result.errorDetails) {
              console.error('STT: Detailed error:', result.errorDetails);
            } else {
              console.error('STT: No detailed error information available.');
            }
          }
        }, error => {
          console.error('STT: Recognizer error:', error);
        });
      } catch (e) {
        console.error('Error initializing speech recognizer:', e);
      }

      return () => {
        if (recognizer) {
          recognizer.close();
          console.log('Speech recognizer closed');
        }
      };
    }
  }, [isListening]);

  return { transcript, isListening, setIsListening };
};

export default useSpeechRecognition;

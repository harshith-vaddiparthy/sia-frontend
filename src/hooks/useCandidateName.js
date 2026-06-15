import { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';

export const useCandidateName = () => {
  const [candidateName, setCandidateName] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const displayName = user.displayName || 'there';
      const firstName = displayName.split(' ')[0]; // Extract the first name
      setCandidateName(firstName);
    }
  }, []);

  // Function to override any incorrect names with the correct one
  const correctNameInText = useCallback(
    (text) => {
      // Regular expression to detect possible variations of the candidate's name
      const nameRegex = new RegExp(`\\b(?:${candidateName}|[A-Z][a-z]*)\\b`, 'gi');

      // Replace any detected name with the correct one
      return text.replace(nameRegex, candidateName);
    },
    [candidateName]
  );

  // Process transcription text directly through the hook
  const processTranscription = useCallback(
    (text) => {
      const correctedText = correctNameInText(text);
      // Any additional text processing can be added here

      return correctedText;
    },
    [correctNameInText]
  );

  return { candidateName, processTranscription };
};

import { useState, useCallback } from 'react';

export const useAIResponse = () => {
    const [response, setResponse] = useState('');

    const refineResponse = useCallback((aiResponse) => {
        let refined = aiResponse.trim();

        // Remove numbers like "1.", "2.", etc.
        refined = refined.replace(/^\d+\.\s+/gm, "");

        // Ensure it asks only one question
        if ((refined.match(/\?/g) || []).length > 1) {
            refined = refined.split('?')[0] + '?';
        }

        // Remove unnecessary special characters
        refined = refined.replace(/[^a-zA-Z0-9?.! ]/g, '');

        setResponse(refined);
        return refined;
    }, []);

    return { response, refineResponse };
};

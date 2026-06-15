// services/sttService.js
const sttService = {
  async convertSpeechToText(audioBlob) {
    const response = await fetch(process.env.REACT_APP_AZURE_SPEECH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.REACT_APP_AZURE_SPEECH_KEY,
        'Content-Type': 'audio/wav'
      },
      body: audioBlob
    });

    if (!response.ok) {
      throw new Error('Failed to convert speech to text');
    }

    const data = await response.json();
    return data;
  }
};

export default sttService;

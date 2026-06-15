// services/ttsService.js
const ttsService = {
  async convertTextToSpeech(text) {
    const response = await fetch(process.env.REACT_APP_AZURE_SPEECH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.REACT_APP_AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml'
      },
      body: `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-Jessa24kRUS'>${text}</voice></speak>`
    });

    if (!response.ok) {
      throw new Error('Failed to convert text to speech');
    }

    const data = await response.blob();
    return data;
  }
};

export default ttsService;

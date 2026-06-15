// services/nlpService.js
const nlpService = {
  async analyzeText(text) {
    const response = await fetch(`${process.env.REACT_APP_AZURE_OPENAI_ENDPOINT}/v1/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_AZURE_OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze text');
    }

    const data = await response.json();
    return data;
  }
};

export default nlpService;

import axios from 'axios';

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chat';

class ChatbotService {
  constructor() {
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(message) {
    try {
      const response = await axios.post(N8N_WEBHOOK_URL, {
        message: message,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      // Handle different response formats from n8n
      // Adjust based on your n8n workflow output structure
      if (response.data) {
        // If n8n returns a simple text response
        if (typeof response.data === 'string') {
          return response.data;
        }

        // If n8n returns an object with a message field
        if (response.data.message) {
          return response.data.message;
        }

        // If n8n returns an object with a response field
        if (response.data.response) {
          return response.data.response;
        }

        // If n8n returns an object with output field
        if (response.data.output) {
          return response.data.output;
        }

        // Fallback: stringify the response
        return JSON.stringify(response.data);
      }

      return 'No response received from chatbot';
    } catch (error) {
      console.error('Chatbot service error:', error);

      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - chatbot took too long to respond');
      }

      if (error.response) {
        // Server responded with error
        throw new Error(`Chatbot error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Request made but no response
        throw new Error('Unable to reach chatbot - check your n8n webhook URL');
      } else {
        // Something else happened
        throw new Error(`Error: ${error.message}`);
      }
    }
  }

  resetSession() {
    this.sessionId = this.generateSessionId();
  }

  getSessionId() {
    return this.sessionId;
  }
}

export default new ChatbotService();

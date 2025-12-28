/**
 * Streaming Service for handling Server-Sent Events (SSE)
 * Note: Your backend doesn't support streaming yet
 * This is prepared for future streaming implementation
 */

class StreamingService {
  constructor() {
    this.abortController = null;
  }

  /**
   * Stream a query response from the API
   */
  async streamQuery({ query, grade, subject, language, conversationId }, onChunk, onComplete, onError) {
    this.abortController = new AbortController();

    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${baseURL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query,              // ✅ Fixed: 'query' not 'question'
          grade: parseInt(grade),
          subject: subject.toLowerCase(),
          language: language.toLowerCase(), // ✅ Fixed: 'language' not 'lang'
          conversationId,
          stream: true        // Backend doesn't support this yet
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';
      let citations = [];

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          try {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'token') {
                fullResponse += data.content;
                onChunk(data.content, fullResponse);
              } else if (data.type === 'citation') {
                citations.push(data.citation);
              } else if (data.type === 'done') {
                onComplete({
                  answer: fullResponse,
                  citations,
                  conversationId: data.conversationId
                });
                return;
              }
            }
          } catch (parseError) {
            console.warn('Failed to parse streaming chunk:', parseError);
          }
        }
      }

      onComplete({
        answer: fullResponse,
        citations,
        conversationId
      });

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Streaming aborted');
        return;
      }
      console.error('Streaming error:', error);
      onError(error);
    }
  }

  /**
   * Abort the current streaming request
   */
  abort() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Simulate streaming for testing (since backend doesn't support it yet)
   */
  async simulateStreaming(text, onChunk, onComplete, delay = 30) {
    const words = text.split(' ');
    let accumulated = '';

    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const word = words[i] + (i < words.length - 1 ? ' ' : '');
      accumulated += word;
      onChunk(word, accumulated);
    }

    // Simulate citations
    const mockCitations = [
      {
        title: 'NCERT Textbook',
        source: 'NCERT',
        chapter: 'Chapter 3',
        page: '45',
        content: 'Relevant excerpt from textbook...'
      }
    ];

    onComplete({
      answer: accumulated,
      citations: mockCitations,
      conversationId: Date.now().toString()
    });
  }
}

export default new StreamingService();

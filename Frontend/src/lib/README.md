# API Integration Documentation

This document explains how the API integration works in the Dashboard component.

## Files

1. `axiosInstance.js` - Configures the Axios instance with default settings and interceptors
2. `mockApiService.js` - Provides mock implementations of all API endpoints for testing
3. `Dashboard.jsx` - Implements the API calls in the main dashboard component

## API Endpoints

The following endpoints are implemented:

1. **GET /chat/history** - Fetch previous Q&A history
2. **POST /chat/ask** - Send user's question and get the answer
3. **POST /chat/feedback** - Record feedback for that Q&A
4. **GET /chat/citation/:id** - Get NCERT reference for that answer

## How It Works

1. Each API call first tries the real API endpoint using Axios
2. If the real API fails, it automatically falls back to the mock API service
3. All API calls include console logging for debugging purposes
4. Error handling is implemented for network failures and other issues

## Usage in Dashboard.jsx

The Dashboard component uses the following functions:

- `fetchChatHistory()` - Called on component mount to load chat history
- `submitQuestion()` - Called when user submits a new question
- `submitFeedback()` - Called when user provides feedback on an answer
- `getCitation()` - Called when user clicks "View Source"

Each function follows the pattern:
1. Try real API first
2. Fall back to mock API if real API fails
3. Update UI with results
4. Show appropriate toast notifications

## Mock Data

The mock API service includes sample data for testing:
```javascript
{
  id: "1",
  question: "What is photosynthesis?",
  answer: "Photosynthesis is the process by which green plants prepare food.",
  citation: "NCERT Class 9 Chapter 5",
  lang: "en"
}
```
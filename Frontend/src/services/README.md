# Services Directory

This directory contains service layer modules that handle API communication and business logic.

## 📁 Files

### chatService.js
**Purpose**: Handles AI query submission and response processing (Module 5)

**Methods**:

#### `sendQuery(query, grade, subject, language, conversationId)`
Send a non-streaming query to the AI backend.

**Parameters**:
- `query` (string): The user's question
- `grade` (string): Student's grade level (e.g., "Grade 9")
- `subject` (string): Subject area (e.g., "Mathematics")
- `language` (string): Preferred language code (e.g., "en", "hi")
- `conversationId` (string|null): Current conversation ID (optional)

**Returns**: Promise<Object>
```javascript
{
  success: boolean,
  answer: string,
  citations: Array,
  conversationId: string,
  timestamp: string,
  error: Object // if success is false
}
```

**Example**:
```javascript
import { sendQuery } from './services/chatService';

const result = await sendQuery(
  "What is photosynthesis?",
  "Grade 9",
  "Science",
  "en",
  "conv-123"
);

if (result.success) {
  console.log(result.answer);
  console.log(result.citations);
}
```

#### `sendStreamingQuery(query, grade, subject, language, conversationId, onChunk, onComplete, onError)`
Send a streaming query for real-time token-by-token responses.

**Parameters**:
- `query` (string): The user's question
- `grade` (string): Student's grade level
- `subject` (string): Subject area
- `language` (string): Preferred language code
- `conversationId` (string|null): Current conversation ID (optional)
- `onChunk` (Function): Callback for each token chunk
- `onComplete` (Function): Callback when streaming completes
- `onError` (Function): Callback for errors

**Example**:
```javascript
import { sendStreamingQuery } from './services/chatService';

await sendStreamingQuery(
  "Explain Newton's laws",
  "Grade 11",
  "Physics",
  "en",
  "conv-123",
  (token, fullText) => {
    console.log('New token:', token);
  },
  (result) => {
    console.log('Complete:', result);
  },
  (error) => {
    console.error('Error:', error);
  }
);
```

#### `getCitationDetails(queryId)`
Get detailed citation information for a specific query.

**Parameters**:
- `queryId` (string): The ID of the query/response

**Returns**: Promise<Object>
```javascript
{
  success: boolean,
  citations: Array,
  queryId: string,
  error: Object // if success is false
}
```

#### `sendQueryWithRetry(query, grade, subject, language, conversationId, maxRetries)`
Send a query with automatic retry logic and exponential backoff.

**Parameters**:
- Same as `sendQuery`
- `maxRetries` (number): Maximum retry attempts (default: 3)

**Returns**: Promise<Object> (same as sendQuery)

**Retry Logic**:
- Attempt 1: Immediate
- Attempt 2: Wait 1 second
- Attempt 3: Wait 2 seconds
- Attempt 4: Wait 4 seconds

---

## 🔌 API Endpoints

### POST /query
Submit a query to the AI backend.

**Request Body**:
```javascript
{
  question: string,
  grade: string,
  subject: string,
  lang: string,
  conversationId: string | null,
  stream: boolean
}
```

**Response**:
```javascript
{
  answer: string,
  citations: Array,
  conversationId: string,
  timestamp: string
}
```

### GET /query/:id/citations
Get citation details for a specific query.

**Response**:
```javascript
{
  citations: Array,
  queryId: string
}
```

---

## 🎯 Usage in Components

### Basic Query
```javascript
import chatService from '../services/chatService';

const handleSubmit = async () => {
  const result = await chatService.sendQuery(
    userQuestion,
    selectedGrade,
    selectedSubject,
    currentLanguage,
    activeConversationId
  );
  
  if (result.success) {
    // Handle success
    setMessages([...messages, {
      role: 'assistant',
      content: result.answer,
      citations: result.citations
    }]);
  } else {
    // Handle error
    showError(result.error.message);
  }
};
```

### Streaming Query
```javascript
import { sendStreamingQuery } from '../services/chatService';

const handleStreamingSubmit = async () => {
  await sendStreamingQuery(
    userQuestion,
    selectedGrade,
    selectedSubject,
    currentLanguage,
    activeConversationId,
    (token, fullText) => {
      // Update UI with each token
      setStreamingText(fullText);
    },
    (result) => {
      // Streaming complete
      setMessages([...messages, {
        role: 'assistant',
        content: result.answer,
        citations: result.citations
      }]);
    },
    (error) => {
      // Handle error
      showError(error.message);
    }
  );
};
```

### Query with Retry
```javascript
import { sendQueryWithRetry } from '../services/chatService';

const handleSubmitWithRetry = async () => {
  const result = await sendQueryWithRetry(
    userQuestion,
    selectedGrade,
    selectedSubject,
    currentLanguage,
    activeConversationId,
    3 // max retries
  );
  
  if (result.success) {
    // Handle success
  } else {
    // All retries failed
    showError(result.error.message);
  }
};
```

---

## 🔧 Error Handling

### Error Types

**NETWORK_ERROR** (code: 0)
- No internet connection
- Server unreachable
- Timeout

**CLIENT_ERROR** (code: 400-499)
- Invalid request
- Authentication failed
- Resource not found

**SERVER_ERROR** (code: 500-599)
- Internal server error
- Service unavailable

**RETRY_EXHAUSTED**
- All retry attempts failed
- Includes last error details

### Error Response Structure
```javascript
{
  success: false,
  answer: null,
  citations: [],
  conversationId: null,
  timestamp: string,
  error: {
    message: string,
    code: number,
    type: string,
    details: Object // optional
  }
}
```

---

## 🧪 Testing

### Unit Tests
```javascript
import { sendQuery } from './chatService';

test('sendQuery returns success response', async () => {
  const result = await sendQuery(
    'Test question',
    'Grade 9',
    'Science',
    'en',
    null
  );
  
  expect(result.success).toBe(true);
  expect(result.answer).toBeDefined();
  expect(result.citations).toBeInstanceOf(Array);
});
```

### Integration Tests
```javascript
test('sendQuery handles network errors', async () => {
  // Mock network failure
  jest.spyOn(axiosInstance, 'post').mockRejectedValue(new Error('Network error'));
  
  const result = await sendQuery('Test', 'Grade 9', 'Science', 'en');
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe('NETWORK_ERROR');
});
```

---

## 📊 Performance Considerations

1. **Caching**: Consider implementing response caching for repeated queries
2. **Debouncing**: Debounce rapid query submissions
3. **Cancellation**: Support query cancellation for streaming
4. **Timeout**: Set appropriate timeout values
5. **Rate Limiting**: Implement client-side rate limiting

---

## 🔒 Security

1. **Input Validation**: All parameters are validated before sending
2. **XSS Prevention**: Responses are sanitized before display
3. **CSRF Protection**: Uses axiosInstance with CSRF tokens
4. **API Keys**: Never expose API keys in client code
5. **Error Messages**: Don't expose sensitive information in errors

---

## 🚀 Future Enhancements

1. **Query Queue**: Queue multiple queries
2. **Offline Support**: Cache queries when offline
3. **Analytics**: Track query performance
4. **A/B Testing**: Test different query formats
5. **Smart Retry**: Adaptive retry strategies

---

## 📝 Notes

- Always use this service instead of calling APIs directly
- Maintain backward compatibility when updating
- Document all breaking changes
- Follow error handling patterns consistently
- Keep service layer stateless

---

**Created**: October 26, 2025  
**Module**: 5 (AI Query Handling)  
**Status**: ✅ Complete

# Webhook Integration for AutoMate

This document explains how the webhook integration works in the AutoMate application.

## Overview

Each workflow card now sends data to an n8n webhook when clicked. The webhook receives:
- Card name
- User data (login information, timestamp, session info)
- Additional information (optional, workflow-specific)
- Workflow type
- Timestamp

## Configuration

### Environment Variables

Add the following webhook URL to your `.env` file:

```env
# N8N Webhook URL (used for all workflows)
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/automate
```

## Webhook Payload Structure

When a workflow card is clicked, the following payload is sent to the n8n webhook:

```json
{
  "cardName": "Email Assistent",
  "userData": {
    "userId": "developer",
    "userName": "developer",
    "userEmail": "developer@automate.local",
    "loginTimestamp": "2025-01-27T10:30:00.000Z",
    "sessionId": "session_1738068600000_abc123def",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "timestamp": "2025-01-27T10:35:00.000Z"
  },
  "additionalInfo": {
    // Optional: workflow-specific data
    "priority": "medium",
    "category": "general",
    "notes": "User wants help with email organization"
  },
  "timestamp": "2025-01-27T10:35:00.000Z",
  "workflowType": "email"
}
```

## User Data Collection

The application automatically collects user data when:
1. User logs in through the developer login page
2. User data is stored in localStorage
3. Data persists across browser sessions
4. Data is cleared when user logs out

### User Data Fields

- `userId`: Unique identifier for the user
- `userName`: Display name of the user
- `userEmail`: Email address of the user
- `loginTimestamp`: When the user logged in
- `sessionId`: Unique session identifier
- `userAgent`: Browser information
- `timestamp`: Current timestamp

## Usage Examples

### Basic Webhook Call

```typescript
import { webhookService } from '@/services/webhookService';

// Send basic webhook
const result = await webhookService.sendWebhook(
  'Email Assistent',
  'email'
);
```

### Webhook with Additional Information

```typescript
// Send webhook with additional data
const result = await webhookService.sendWebhook(
  'Email Assistent',
  'email',
  {
    priority: 'high',
    category: 'urgent',
    notes: 'User needs immediate assistance'
  }
);
```

### Test Button Integration

Each workflow page now includes a "Test Webhook" button in the header that:
- Sends a test webhook with `testMode: true` flag
- Shows loading, success, and error states
- Automatically resets status after 3 seconds
- Located in the top-right corner of the workflow page

The test button sends additional information:
```json
{
  "testMode": true,
  "testTimestamp": "2025-01-27T10:35:00.000Z",
  "source": "workflow-page-test-button"
}
```

### Storing User Data

```typescript
import { useUser } from '@/contexts/UserContext';

const { login, logout, updateUserData } = useUser();

// Login user
login({
  userId: 'user123',
  userName: 'John Doe',
  userEmail: 'john@example.com'
});

// Update user data
updateUserData({
  userEmail: 'newemail@example.com'
});

// Logout user
logout();
```

## Error Handling

The webhook service includes comprehensive error handling:

- Network errors are caught and logged
- Missing webhook URLs are handled gracefully
- Failed requests return error messages
- All errors are logged to the console

## Development

### Testing Webhooks

1. Set up your n8n instance with webhook nodes
2. Add the webhook URLs to your `.env` file
3. Click on workflow cards to navigate to the workflow page
4. Use the "Test Webhook" button on each workflow page to test the integration
5. Check the browser console for webhook responses

### Test Button Features

- **Visual Feedback**: Shows loading spinner, success checkmark, or error icon
- **Prominent Placement**: Located in the workflow page header for easy access
- **Auto-reset**: Status indicators automatically reset after 3 seconds
- **Test Mode**: Sends additional test metadata to distinguish from regular usage
- **Error Handling**: Displays user-friendly error messages
- **Responsive Design**: Adapts to different screen sizes

### Adding New Workflow Types

Since all workflows use the same webhook URL, adding new workflow types is simple:

1. Add the workflow type to your workflow data:
   ```typescript
   {
     title: "New Workflow",
     description: "Description of the new workflow",
     icon: NewIcon,
     color: "new" as const,
     workflowType: "newWorkflow",
     path: "/workflow/new-workflow"
   }
   ```

2. The webhook will automatically receive the new workflow type in the payload:
   ```json
   {
     "workflowType": "newWorkflow",
     "cardName": "New Workflow",
     // ... rest of payload
   }
   ```

3. Your n8n workflow can use the `workflowType` field to route to different logic based on the workflow type.

## Security Considerations

- Webhook URLs are stored in environment variables
- User data is stored in localStorage (consider server-side storage for production)
- No sensitive data is sent in webhook payloads
- All webhook calls are made over HTTPS

## Troubleshooting

### Common Issues

1. **Webhook not sending**: Check that the `VITE_N8N_WEBHOOK_URL` is correctly set in `.env`
2. **User data missing**: Ensure user is logged in before clicking workflow cards
3. **Network errors**: Check n8n instance is running and accessible
4. **CORS issues**: Ensure n8n webhook endpoint allows requests from your domain
5. **Workflow routing**: Use the `workflowType` field in your n8n workflow to route to different logic

### Debug Mode

Enable debug logging by checking the browser console for webhook-related messages.

## Files Modified

- `src/services/webhookService.ts` - Main webhook service (updated to use single webhook)
- `src/contexts/UserContext.tsx` - User data management
- `src/components/WorkflowCard.tsx` - Clean workflow cards
- `src/pages/Index.tsx` - Workflow data with types
- `src/pages/WorkflowPage.tsx` - Test button and webhook integration
- `src/pages/DeveloperLogin.tsx` - Integrated with user context
- `src/App.tsx` - Added UserProvider
- `.env` - Single webhook URL configuration

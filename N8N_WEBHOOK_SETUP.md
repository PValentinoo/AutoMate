# N8N Webhook Setup Guide

This guide will help you set up the n8n webhook to receive data from your AutoMate application.

## Prerequisites

- n8n instance running (you have it running on `http://localhost:5678`)
- Access to n8n web interface

## Step 1: Create a New Workflow

1. Open your n8n instance at `http://localhost:5678`
2. Click "New Workflow" or the "+" button
3. Name your workflow: "AutoMate Webhook Handler"

## Step 2: Add Webhook Node

1. In the workflow editor, click the "+" button to add a node
2. Search for "Webhook" and select it
3. Configure the webhook node:
   - **HTTP Method**: POST
   - **Path**: `webhook-test/AutoMate_Start`
   - **Response Mode**: "On Received"
   - **Response Code**: 200
   - **Response Body**: `{"success": true, "message": "Webhook received successfully"}`

## Step 3: Test the Webhook

1. Click "Execute Workflow" on the webhook node
2. Copy the webhook URL (should be `http://localhost:5678/webhook-test/AutoMate_Start`)
3. Verify this matches your `.env` file:
   ```env
   VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/AutoMate_Start
   ```

## Step 4: Add Processing Logic

After the webhook node, you can add additional nodes to process the data:

### Option A: Simple Logging
1. Add a "Set" node after the webhook
2. Configure it to log the received data:
   - **Keep Only Set Fields**: false
   - **Fields to Set**:
     - **Name**: `workflowType`
     - **Value**: `{{ $json.workflowType }}`
     - **Name**: `cardName`
     - **Value**: `{{ $json.cardName }}`

### Option B: Switch Based on Workflow Type
1. Add a "Switch" node after the webhook
2. Configure the switch:
   - **Data Type**: String
   - **Value**: `{{ $json.workflowType }}`
   - **Rules**:
     - **Rule 1**: `email` → Connect to email processing node
     - **Rule 2**: `test` → Connect to test processing node
     - **Rule 3**: `manual` → Connect to manual processing node
     - **Rule 4**: `economics` → Connect to economics processing node
     - **Rule 5**: `idea` → Connect to idea processing node

## Step 5: Activate the Workflow

1. Click the "Active" toggle in the top-right corner
2. The workflow should now be active and listening for webhooks

## Step 6: Test from AutoMate

1. Go to your AutoMate application
2. Click on any workflow card to navigate to the workflow page
3. Click the "Test Webhook" button
4. Check the n8n workflow execution logs to see the received data

## Expected Webhook Payload

Your webhook will receive data in this format:

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
    "testMode": true,
    "testTimestamp": "2025-01-27T10:35:00.000Z",
    "source": "workflow-page-test-button"
  },
  "timestamp": "2025-01-27T10:35:00.000Z",
  "workflowType": "email"
}
```

## Troubleshooting

### 404 Error
- **Cause**: Webhook not created or wrong URL
- **Solution**: 
  1. Check that the webhook node is active
  2. Verify the path matches exactly: `webhook-test/AutoMate_Start`
  3. Make sure the workflow is activated

### CORS Error
- **Cause**: Browser blocking the request
- **Solution**: 
  1. Add CORS headers in n8n webhook response
  2. Or use a proxy server

### Connection Refused
- **Cause**: n8n not running
- **Solution**: Start your n8n instance

## Advanced Configuration

### Adding Authentication
If you want to secure your webhook:

1. In the webhook node, go to "Authentication"
2. Select "Header Auth" or "Query Auth"
3. Add the authentication details to your AutoMate webhook service

### Adding Data Validation
1. Add a "Code" node after the webhook
2. Validate the incoming data:
   ```javascript
   const requiredFields = ['cardName', 'workflowType', 'userData'];
   const missingFields = requiredFields.filter(field => !$input.first().json[field]);
   
   if (missingFields.length > 0) {
     throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
   }
   
   return $input.all();
   ```

### Adding Database Storage
1. Add a database node (e.g., "Postgres", "MySQL")
2. Configure to store the webhook data
3. Connect it after the webhook node

## Next Steps

Once your webhook is working:

1. **Process the data** based on workflow type
2. **Send notifications** or trigger other workflows
3. **Store data** in a database
4. **Integrate with external services** (email, Slack, etc.)

## Support

If you encounter issues:
1. Check the n8n execution logs
2. Verify the webhook URL in your browser's network tab
3. Test the webhook URL directly with a tool like Postman
4. Check the AutoMate browser console for error messages

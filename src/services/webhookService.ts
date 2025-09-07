interface UserData {
  userId?: string;
  userEmail?: string;
  userName?: string;
  loginTimestamp?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

interface WebhookPayload {
  cardName: string;
  userData: UserData;
  additionalInfo?: Record<string, any>;
  timestamp: string;
  workflowType: string;
}

interface WebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class WebhookService {
  private getWebhookUrl(): string | null {
    const url = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (!url || url.trim() === '') {
      console.warn('VITE_N8N_WEBHOOK_URL is not set in environment variables');
      return null;
    }
    return url.trim();
  }

  private async collectUserData(): Promise<UserData> {
    // Collect basic user data
    const userData: UserData = {
      loginTimestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // Try to get user info from localStorage (if available)
    try {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userData.userId = parsedUser.userId;
        userData.userEmail = parsedUser.userEmail;
        userData.userName = parsedUser.userName;
        userData.sessionId = parsedUser.sessionId;
      }
    } catch (error) {
      console.warn('Could not retrieve user data from localStorage:', error);
    }

    // Generate session ID if not available
    if (!userData.sessionId) {
      userData.sessionId = this.generateSessionId();
    }

    return userData;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendWebhook(
    cardName: string,
    workflowType: string,
    additionalInfo?: Record<string, any>
  ): Promise<WebhookResponse> {
    try {
      const webhookUrl = this.getWebhookUrl();
      
      if (!webhookUrl) {
        console.warn('No webhook URL configured');
        return {
          success: false,
          error: 'No webhook URL configured. Please set VITE_N8N_WEBHOOK_URL in your .env file'
        };
      }

      const userData = await this.collectUserData();
      
      const payload: WebhookPayload = {
        cardName,
        userData,
        additionalInfo,
        timestamp: new Date().toISOString(),
        workflowType,
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Webhook not found (404). Please check that the n8n webhook is created and the URL is correct: ${webhookUrl}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        // Webhook response is not JSON, treating as success
        responseData = null;
      }
      
      return {
        success: true,
        message: 'Webhook sent successfully',
      };
    } catch (error) {
      console.error('Error sending webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Method to store user data (can be called when user logs in)
  storeUserData(userData: Partial<UserData>): void {
    try {
      const existingData = localStorage.getItem('userData');
      const currentData = existingData ? JSON.parse(existingData) : {};
      
      const updatedData = {
        ...currentData,
        ...userData,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem('userData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  // Method to clear user data (can be called when user logs out)
  clearUserData(): void {
    try {
      localStorage.removeItem('userData');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
}

export const webhookService = new WebhookService();
export type { UserData, WebhookPayload, WebhookResponse };

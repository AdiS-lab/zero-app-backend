export interface EmailBody {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface PushSubscriptionObject {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushBody {
  title: string;
  message: string;
}

export interface EmailConversation {
  contactName: string;
  emailAddress: string;
  totalEmails: number;
  messages: {
    subject: string;
    body: string;
    timestamp: string;
    fromMe: boolean;
  }[];
}

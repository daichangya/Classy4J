export interface ChatMessage {
  id?: number;
  role: string;
  content: string;
  type: MessageType;
  sender: string;
  receiver: string;
  createdAt?: string;
  conversationId?: number;
  timestamp?: string;
}

export enum MessageType {
  CHAT = 'CHAT',
  SYSTEM = 'SYSTEM',
  TOOL_CALL = 'TOOL_CALL',
  TOOL_RESPONSE = 'TOOL_RESPONSE'
} 
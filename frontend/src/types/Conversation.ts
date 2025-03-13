import { ChatMessage } from './Message';

export interface ConversationPreview {
  id?: number;
  title: string;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
  participants?: string;
}

export interface Conversation extends ConversationPreview {
  messages: ChatMessage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConversationDto {
  title: string;
  participants: string;
  messages: ChatMessage[];
}
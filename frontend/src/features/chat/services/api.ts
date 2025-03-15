import axios from 'axios';
import { ChatMessage } from '../types/Message';
import { ConversationPreview, CreateConversationDto } from '../types/Conversation';

const API_BASE = '/api';

export const conversationApi = {
  getAll: () => axios.get<ConversationPreview[]>(`${API_BASE}/conversations/getAll`),
  get: (id: number) => axios.get<ConversationPreview>(`${API_BASE}/conversations/${id}`),
  create: (data: CreateConversationDto) => axios.post<ConversationPreview>(`${API_BASE}/conversations/create`, data),
  delete: (id: number) => axios.delete(`${API_BASE}/conversations/${id}`),
  getMessages: (conversationId: number) => axios.get<ChatMessage[]>(`${API_BASE}/conversations/${conversationId}/messages`),
  streamChat: (conversationId: number, message: ChatMessage) => {
    return fetch(`${API_BASE}/conversations/${conversationId}/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(message)
    });
  }
};
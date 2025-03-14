import { api } from '../../../services/api';
import { ChatMessage } from '../types/Message';
import { Conversation, ConversationPreview, CreateConversationDto } from '../types/Conversation';

// 聊天相关API
export const chatApi = {
    getHistory: (sender: string, receiver: string) =>
        api.get<ChatMessage[]>(`/api/chat/history?sender=${sender}&receiver=${receiver}`),
    sendMessage: (message: ChatMessage) =>
        api.post<ChatMessage>('/api/chat/send', message),
};

// 会话相关API
export const conversationApi = {
    create: (conversation: CreateConversationDto) =>
        api.post<Conversation>('/api/conversations/create', conversation),
    get: (id: number) =>
        api.get<Conversation>(`/api/conversations/${id}`),
    getAll: () =>
        api.get<ConversationPreview[]>('/api/conversations/getAll'),
    update: (id: number, conversation: Conversation) =>
        api.put<Conversation>(`/api/conversations/${id}`, conversation),
    delete: (id: number) =>
        api.delete(`/api/conversations/${id}`),
    getMessages: (id: number) =>
        api.get<ChatMessage[]>(`/api/conversations/${id}/messages`),
    addMessage: (id: number, message: ChatMessage) =>
        api.post<ChatMessage>(`/api/conversations/${id}/messages`, message),
}; 
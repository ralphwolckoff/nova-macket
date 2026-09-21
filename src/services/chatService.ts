// ============================================================================
// NOVAMARKET - CHAT / MESSAGING SERVICE
// ============================================================================

import { ChatMessage } from '../types';
import { apiClient, localRepo } from './apiClient';

export const ChatService = {
  async getAll(): Promise<ChatMessage[]> {
    try {
      return await apiClient.request<ChatMessage[]>('/messages');
    } catch {
      return localRepo.getMessages();
    }
  },

  async getBySellerId(sellerId: string): Promise<ChatMessage[]> {
    const list = await this.getAll();
    return list.filter((m) => m.sellerId === sellerId);
  },

  async sendMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    try {
      return await apiClient.request<ChatMessage>('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
    } catch {
      const list = localRepo.getMessages();
      const newMsg: ChatMessage = {
        ...messageData,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      list.push(newMsg);
      localRepo.saveMessages(list);
      return newMsg;
    }
  },
};

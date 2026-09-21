// ============================================================================
// NOVAMARKET - CHAT / MESSAGING QUERIES (TANSTACK QUERY)
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '../services/chatService';
import { ChatMessage } from '../types';

export const chatKeys = {
  all: ['messages'] as const,
  bySeller: (sellerId: string) => [...chatKeys.all, 'seller', sellerId] as const,
};

export function useMessages(sellerId?: string) {
  return useQuery({
    queryKey: sellerId ? chatKeys.bySeller(sellerId) : chatKeys.all,
    queryFn: () => (sellerId ? ChatService.getBySellerId(sellerId) : ChatService.getAll()),
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) =>
      ChatService.sendMessage(messageData),
    onSuccess: (newMsg) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
      queryClient.invalidateQueries({ queryKey: chatKeys.bySeller(newMsg.sellerId) });
    },
  });
}

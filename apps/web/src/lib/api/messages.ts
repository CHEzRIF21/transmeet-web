import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";

export function useConversations(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      apiRequest<unknown[]>("messages/conversations", { accessToken }).then(
        (r) => (r.success ? (r.data ?? []) : [])
      ),
    enabled: !!accessToken,
  });
}

export function useMessages(
  conversationId: string | undefined,
  accessToken: string | undefined
) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      apiRequest<unknown[]>(
        `messages?conversationId=${conversationId}`,
        { accessToken }
      ).then((r) => (r.success ? (r.data ?? []) : [])),
    enabled: !!conversationId && !!accessToken,
  });
}

export function useSendMessage(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiRequest("messages", {
        method: "POST",
        body: JSON.stringify(data),
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

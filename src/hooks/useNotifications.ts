'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/lib/api-client';
import { useNotificationStore } from '@/stores/notificationStore';
import { useEffect } from 'react';

export function useNotifications(params?: any) {
  const { setNotifications } = useNotificationStore();

  const query = useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await notificationApi.list(params);
      const body = response.data;
      return { data: body.items || body.data, pagination: body.pagination };
    },
  });

  useEffect(() => {
    if (query.data?.data) {
      setNotifications(query.data.data);
    }
  }, [query.data, setNotifications]);

  return query;
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await notificationApi.getUnreadCount();
      return response.data;
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { markRead } = useNotificationStore();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await notificationApi.markRead({ notificationIds: ids });
      return response.data;
    },
    onSuccess: (_data, ids) => {
      ids.forEach((id) => markRead(id));
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const { markAllRead } = useNotificationStore();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationApi.markAllRead();
      return response.data;
    },
    onSuccess: () => {
      markAllRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

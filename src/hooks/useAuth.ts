import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { LoginInput, ChangePasswordInput } from '@shared/schemas';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      try {
        const res = await api.get<{ success: boolean; user: AuthUser }>('/auth/session');
        return res.user;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const res = await api.post<{ success: boolean; user: AuthUser; token?: string }>('/auth/login', credentials);
      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'session'], data.user);
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return api.post<{ success: boolean }>('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'session'], null);
      queryClient.clear();
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (passwords: ChangePasswordInput) => {
      return api.post<{ success: boolean; message: string }>('/auth/change-password', passwords);
    },
  });

  return {
    user: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    isAuthenticated: Boolean(sessionQuery.data),
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
}

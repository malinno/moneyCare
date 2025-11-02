import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { userService, UserResponse } from '@services/api/userService';

export interface UseUserOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export const useUser = (options?: UseUserOptions): UseQueryResult<UserResponse, Error> => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
  } = options || {};

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: userService.getMe,
    enabled,
    staleTime,
    cacheTime,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) errors
      if (error && error.status === 401) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    onError: (error: any) => {
      console.error('Error fetching user data:', error);
    },
  });
};

// Hook to get just the username
export const useUsername = (options?: UseUserOptions): string | undefined => {
  const { data: user } = useUser(options);
  return user?.username;
};

// Hook to get user ID
export const useUserId = (options?: UseUserOptions): string | undefined => {
  const { data: user } = useUser(options);
  return user?.id;
};

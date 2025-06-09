// Hook to handle request filtering logic
import { useMemo } from 'react';
import { HitRequest } from '@/types';

export const useRequestFilters = (
  requests: HitRequest[],
  dismissedIds: string[] = []
) => {
  const favoriteRequests = useMemo(() => {
    // Favorites are pending requests with no expiry date
    const favorites = requests.filter(req => 
      req.status === 'pending' && 
      req.expiresAt === null && 
      !dismissedIds.includes(req.id)
    );
    
    return [...favorites].sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      
      if (urgencyDiff !== 0) return urgencyDiff;
      return b.createdAt - a.createdAt;
    });
  }, [requests, dismissedIds]);

  const pendingRequests = useMemo(() => {
    // Regular pending requests that are not favorites (have expiry date)
    const pending = requests.filter(req => 
      req.status === 'pending' && 
      req.expiresAt !== null && 
      !dismissedIds.includes(req.id)
    );
    
    return [...pending].sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      
      if (urgencyDiff !== 0) return urgencyDiff;
      return b.createdAt - a.createdAt;
    });
  }, [requests, dismissedIds]);

  const expiredRequests = useMemo(() => 
    requests.filter(req => req.status === 'expired')
      .sort((a, b) => b.createdAt - a.createdAt),
    [requests]
  );

  return {
    favoriteRequests,
    pendingRequests,
    expiredRequests
  };
};
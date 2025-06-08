export const formatDistanceToNow = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }
  
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

export const formatTimeToNow = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((timestamp - now) / 1000);
  
  if (diffInSeconds < 0) {
    return 'expired';
  }
  
  if (diffInSeconds < 60) {
    return 'in a few seconds';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `in ${diffInMinutes}m`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `in ${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `in ${diffInDays}d`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `in ${diffInWeeks}w`;
};
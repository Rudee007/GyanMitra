// utils/formatters.ts
/**
 * Format timestamp to relative time
 * @param isoString - ISO date string
 * @returns Relative time string (e.g., "2h ago", "Yesterday")
 */
export const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
  
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // Format as date for older
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  /**
   * Get subject icon and color
   */
  export const getSubjectStyle = (subject: string) => {
    const styles: Record<string, { icon: string; color: string }> = {
      math: { icon: 'calculator', color: '#2196F3' },
      science: { icon: 'flask', color: '#4CAF50' },
      social_science: { icon: 'globe', color: '#FF9800' },
      english: { icon: 'book', color: '#9C27B0' },
      hindi: { icon: 'language', color: '#F44336' },
      sanskrit: { icon: 'leaf', color: '#FF6F00' },
    };
  
    return styles[subject] || { icon: 'book', color: '#757575' };
  };
  
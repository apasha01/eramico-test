/**
 * Simple event system for updating notification counts across components
 */

// Event names
export const NOTIFICATION_EVENTS = {
  UNREAD_COUNT_UPDATED: 'unread_count_updated',
};

// Helper to dispatch notification count updates
export const updateNotificationCount = (count: number) => {
  const event = new CustomEvent(NOTIFICATION_EVENTS.UNREAD_COUNT_UPDATED, { 
    detail: { count }
  });
  document.dispatchEvent(event);
};

// Helper to clear notification count (set to zero)
export const clearNotificationCount = () => {
  updateNotificationCount(0);
};

"use client";
import React, { createContext, useContext } from "react";

// Context only holds unread count (number). If future needs arise, can be extended to an object.
export const UnreadMessagesContext = createContext<number>(0);
export const useUnreadMessages = () => useContext(UnreadMessagesContext);

interface UnreadMessagesProviderProps {
  value: number;
  children: React.ReactNode;
}

export const UnreadMessagesProvider: React.FC<UnreadMessagesProviderProps> = ({ value, children }) => {
  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

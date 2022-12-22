import React, { createContext, useCallback, useContext, useState } from "react";
import { v4 } from "uuid";

import ToastContainer from "../components/ToastContainer";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addToast = useCallback(({ type, title, description }) => {
    const id = v4();

    const toast = {
      id,
      type,
      title,
      description,
    };

    setMessages((oldMessages) => [...oldMessages, toast]);
  }, []);

  const removeToast = useCallback((id) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within an ToastContextProvider");
  }
  return context;
}

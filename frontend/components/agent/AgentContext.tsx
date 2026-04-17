'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AgentContextType {
  isOpen: boolean;
  prefillQuestion: string;
  openAgent: (question?: string) => void;
  closeAgent: () => void;
  clearPrefill: () => void;
}

const AgentContext = createContext<AgentContextType>({
  isOpen: false,
  prefillQuestion: '',
  openAgent: () => {},
  closeAgent: () => {},
  clearPrefill: () => {},
});

export function AgentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillQuestion, setPrefillQuestion] = useState('');

  const openAgent = useCallback((question = '') => {
    setPrefillQuestion(question);
    setIsOpen(true);
  }, []);

  const closeAgent = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearPrefill = useCallback(() => {
    setPrefillQuestion('');
  }, []);

  return (
    <AgentContext.Provider value={{ isOpen, prefillQuestion, openAgent, closeAgent, clearPrefill }}>
      {children}
    </AgentContext.Provider>
  );
}

export const useAgent = () => useContext(AgentContext);

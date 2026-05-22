import React, { createContext, ReactNode, useContext, useState } from 'react';

type User = { id: string; name?: string; email?: string; provider?: string; token?: string } | null;
type Inquiry = {
  id: string;
  productType?: string;
  brandName?: string;
  designDetails?: string;
  quantity?: number | string;
  createdAt: number;
};

type AppState = {
  user: User;
  inquiries: Inquiry[];
  setUser: (u: User) => void;
  setInquiries: (i: Inquiry[]) => void;
  logout: () => void;
  addInquiry: (i: Omit<Inquiry, 'id' | 'createdAt'> | any) => Inquiry;
  updateInquiry: (id: string, updated: Partial<Inquiry>) => void;
};

const Context = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  function addInquiry(data: Omit<Inquiry, 'id' | 'createdAt'> | any) {
    // If id is provided (like from DB), use that, otherwise assign localized ID
    const inquiry: Inquiry = {
      ...data,
      id: data.id || `${Date.now()}`,
      createdAt: data.createdAt || Date.now(),
    };
    setInquiries((s) => [inquiry, ...s]);
    return inquiry;
  }

  function updateInquiry(id: string, updated: Partial<Inquiry>) {
    setInquiries((s) => s.map(iq => iq.id === id ? { ...iq, ...updated } : iq));
  }

  function logout() {
    setUser(null);
    setInquiries([]);
  }

  return (
    <Context.Provider value={{ user, inquiries, setUser, setInquiries, logout, addInquiry, updateInquiry }}>
      {children}
    </Context.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

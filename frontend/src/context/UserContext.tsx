import { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/axios';  // fix: use named import if you exported it as `export const api = axios.create()`

interface User {
  id: string;
  email: string;
  name?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const API_URL = process.env.API_URL || 'http://localhost:4000';;
  useEffect(() => {
    api.get(`${API_URL}/api/auth/me`)
      .then(res => {
        if (res.data?.id) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [contractorProfile, setContractorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/auth/me');
      if (data.success) {
        setUser(data.user);
        setContractorProfile(data.contractorProfile || null);
      } else {
        setUser(null);
        setContractorProfile(null);
      }
    } catch (err) {
      setUser(null);
      setContractorProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.success) {
      setUser(data.user);
      await fetchMe();
    }
    return data;
  };

  const registerCustomer = async (formData) => {
    const data = await apiFetch('/auth/register-customer', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (data.success) {
      setUser(data.user);
      await fetchMe();
    }
    return data;
  };

  const registerContractor = async (formData) => {
    const data = await apiFetch('/auth/register-contractor', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (data.success) {
      setUser(data.user);
      await fetchMe();
    }
    return data;
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      // Ignore
    } finally {
      setUser(null);
      setContractorProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      contractorProfile,
      loading,
      login,
      registerCustomer,
      registerContractor,
      logout,
      refreshUser: fetchMe
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

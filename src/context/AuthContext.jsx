import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem('jm_token') || null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case 'LOGOUT':
      return { ...initialState, token: null, loading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('jm_token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: res.data.data, token },
      });
    } catch {
      localStorage.removeItem('jm_token');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data.data;
    localStorage.setItem('jm_token', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    await loadUser();
    return user;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token, user } = res.data.data;
    localStorage.setItem('jm_token', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    await loadUser();
    return user;
  };

  const logout = () => {
    localStorage.removeItem('jm_token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (data) => dispatch({ type: 'UPDATE_USER', payload: data });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

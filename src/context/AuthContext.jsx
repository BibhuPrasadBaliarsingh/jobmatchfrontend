import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../services/api';

const missingProvider = (fn) => async () => {
  throw new Error(`AuthContext: ${fn} called but <AuthProvider> is missing`);
};

const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  error: null,
  login: missingProvider('login'),
  register: missingProvider('register'),
  logout: () => {
    throw new Error('AuthContext: logout called but <AuthProvider> is missing');
  },
  updateUser: () => {
    throw new Error('AuthContext: updateUser called but <AuthProvider> is missing');
  },
  loadUser: missingProvider('loadUser'),
});

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
      console.debug('[Auth] loadUser: token found, fetching /auth/me');
      const res = await api.get('/auth/me');
      console.debug('[Auth] loadUser: /auth/me response', res.data);
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

  const login = async (authData, password) => {
    const payload = typeof authData === 'string' ? { email: authData, password } : authData;
    try {
      const res = await api.post('/auth/login', payload);
      console.debug('[Auth] login response', res.data);
      const { token, user } = res.data.data;
      localStorage.setItem('jm_token', token);
      console.debug('[Auth] login: token saved to localStorage');
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      return user;
    } catch (err) {
      console.error('[Auth] login error', err.response?.data || err.message || err);
      throw err;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token, user } = res.data.data;
    localStorage.setItem('jm_token', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
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
  return useContext(AuthContext);
};

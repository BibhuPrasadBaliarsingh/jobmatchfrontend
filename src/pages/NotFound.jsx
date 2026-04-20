import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  const home = user ? `/${user.role}/dashboard` : '/';

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col items-center justify-center p-6 text-center">
      <p className="font-mono text-8xl font-bold text-ink-200 mb-4">404</p>
      <h1 className="font-display text-2xl font-bold text-ink-900 mb-2">Page not found</h1>
      <p className="text-ink-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to={home} className="btn-primary">← Back to home</Link>
    </div>
  );
}

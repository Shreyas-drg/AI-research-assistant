'use client';

import React, { useState } from 'react';
import { loginUser, registerUser } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (!email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (!isLogin && password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      let authData;

      if (isLogin) {
        // Login
        authData = await loginUser(email, password);
      } else {
        // Register
        authData = await registerUser(email, password, name || email.split('@')[0]);
      }

      // Store token and email
      const token = authData.data.token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      if (name) localStorage.setItem('userName', name);

      onSuccess(email, token);
      onClose();

      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setIsLogin(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold mb-2">{isLogin ? '🔐 Login' : '✍️ Sign Up'}</h2>
          <p className="text-indigo-100">Welcome to AI Research Assistant</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Name Input (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Min. 6 characters, 1 uppercase, 1 number
              </p>
            )}
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>

          {/* Toggle Mode */}
          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="text-gray-700 font-semibold hover:text-gray-900"
          >
            Cancel
          </button>
          <p className="text-xs text-gray-500">Secure with MongoDB Atlas</p>
        </div>
      </div>
    </div>
  );
};

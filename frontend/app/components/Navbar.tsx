'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onAuthClick?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onAuthClick, isAuthenticated, userEmail }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section - Logo and Brand */}
          <div className="flex items-center gap-8">
            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-white hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
              >
                <span className="text-xl">☰</span>
                <span className="hidden sm:inline font-semibold">Menu</span>
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
                  <Link
                    href="/"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <span className="text-lg">📚</span>
                    <div>
                      <p className="font-semibold">Home</p>
                      <p className="text-xs text-gray-500">Back to summarizer</p>
                    </div>
                  </Link>

                  <div className="border-t border-gray-200"></div>

                  <Link
                    href="/?view=papers"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="font-semibold">My Papers</p>
                      <p className="text-xs text-gray-500">View saved papers</p>
                    </div>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <span className="text-lg">⚙️</span>
                    <div>
                      <p className="font-semibold">Settings</p>
                      <p className="text-xs text-gray-500">Preferences & options</p>
                    </div>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <span className="text-lg">❓</span>
                    <div>
                      <p className="font-semibold">Help & Support</p>
                      <p className="text-xs text-gray-500">Get assistance</p>
                    </div>
                  </Link>

                  <div className="border-t border-gray-200"></div>

                  <Link
                    href="/"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <span className="text-lg">📖</span>
                    <div>
                      <p className="font-semibold">Documentation</p>
                      <p className="text-xs text-gray-500">Learn more</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Brand */}
            <h1 className="hidden md:block text-white font-bold text-xl">📚 AI Research Assistant</h1>
          </div>

          {/* Right Section - Auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-3 text-white hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">{userEmail?.split('@')[0]}</span>
                    <span className="text-xs opacity-75">Logged in</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
                    {userEmail?.charAt(0).toUpperCase()}
                  </div>
                </button>

                <div className="absolute right-0 mt-0 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-sm">{userEmail}</p>
                    <p className="text-xs text-gray-500">Account</p>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm"
                  >
                    <span>👤</span>
                    <span>View Profile</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm"
                  >
                    <span>⚙️</span>
                    <span>Account Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 hover:text-red-600 transition text-sm border-t border-gray-200"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition shadow-md"
              >
                🔐 Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};

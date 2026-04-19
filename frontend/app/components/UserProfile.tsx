'use client';

import React from 'react';

interface UserProfileProps {
  email: string;
  onEdit?: () => void;
  onLogout?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ email, onEdit, onLogout }) => {
  const userName = email.split('@')[0];
  const userInitial = email.charAt(0).toUpperCase();

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Background */}
      <div className="h-24 bg-gradient-to-r from-indigo-600 to-indigo-700" />

      {/* Profile Card */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-12 mb-6">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-lg">
            {userInitial}
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{userName}</h2>
          <p className="text-gray-600 text-sm mb-4">{email}</p>
          <p className="text-xs text-gray-500">Member since {new Date().toLocaleDateString()}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-xs text-gray-600">Papers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-xs text-gray-600">Comparisons</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">0</p>
            <p className="text-xs text-gray-600">Saved</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            ✏️ Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            🚪 Logout
          </button>
        </div>

        {/* Account Settings */}
        <div className="mt-6 space-y-2">
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2">
            <span>🔐</span>
            <span>Change Password</span>
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2">
            <span>🔔</span>
            <span>Notifications</span>
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2">
            <span>🌙</span>
            <span>Theme & Appearance</span>
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2">
            <span>💾</span>
            <span>Data & Privacy</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Powered by MongoDB Atlas • Secure Storage
        </p>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { getUserPapers } from '../lib/api';

interface UserData {
  email: string;
  name?: string;
  createdAt?: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paperCount, setPaperCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');

    if (!token || !email) {
      router.push('/');
      return;
    }

    setIsAuthenticated(true);
    setUserEmail(email);
    setUserData({ email });

    // Fetch user papers
    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token: string) => {
    setIsLoading(true);
    try {
      const papers = await getUserPapers(token);
      setPaperCount(papers.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  if (!isAuthenticated || isLoading) {
    return (
      <>
        <Navbar 
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
        />
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden py-5 perspective-[1200px] pt-32">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-white text-lg">Loading profile...</p>
          </div>
        </main>
      </>
    );
  }

  const userInitial = userEmail.charAt(0).toUpperCase();
  const userName = userEmail.split('@')[0];

  return (
    <>
      <Navbar 
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
      />

      <main className="relative flex min-h-screen overflow-hidden py-5 perspective-[1200px] pt-32">
        <div
          className="pointer-events-none absolute -left-20 -top-[70px] h-80 w-80 animate-float-blob rounded-full bg-indigo-500/35 blur-[55px] motion-reduce:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-[90px] -right-[90px] h-80 w-80 animate-float-blob rounded-full bg-sky-400/28 blur-[55px] [animation-delay:1.8s] motion-reduce:hidden"
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-[900px] px-1 mx-auto pb-40">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">👤 My Profile</h1>
              <p className="text-indigo-100">Manage your account and view statistics</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              ← Back Home
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-amber-300 bg-amber-100 p-4">
              <p className="text-sm text-amber-800">{error}</p>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-white shadow-lg overflow-hidden">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-700" />

                {/* Profile Content */}
                <div className="px-6 pb-6">
                  {/* Avatar */}
                  <div className="flex justify-start -mt-16 mb-6">
                    <div className="w-32 h-32 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center text-5xl font-bold text-indigo-600 shadow-lg">
                      {userInitial}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{userName}</h2>
                    <p className="text-gray-600 text-base mb-4">{userEmail}</p>
                    <p className="text-sm text-gray-500">
                      Member since {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-gray-200">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-indigo-600">{paperCount}</p>
                      <p className="text-sm text-gray-600 mt-2">Papers Uploaded</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-indigo-600">0</p>
                      <p className="text-sm text-gray-600 mt-2">Comparisons</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-indigo-600">0</p>
                      <p className="text-sm text-gray-600 mt-2">Saved Items</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push('/?view=papers')}
                      className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                      📚 View My Papers
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition flex items-center justify-center gap-2"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="lg:col-span-1">
              <div className="rounded-xl bg-white shadow-lg overflow-hidden h-fit sticky top-32">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4">
                  <h3 className="text-lg font-bold text-gray-800">⚙️ Settings</h3>
                </div>

                <div className="space-y-1 p-4">
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition flex items-center gap-2 font-medium">
                    <span>🔐</span>
                    <span>Change Password</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition flex items-center gap-2 font-medium">
                    <span>🔔</span>
                    <span>Notifications</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition flex items-center gap-2 font-medium">
                    <span>🌙</span>
                    <span>Theme & Appearance</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition flex items-center gap-2 font-medium">
                    <span>🛡️</span>
                    <span>Privacy & Data</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition flex items-center gap-2 font-medium">
                    <span>📋</span>
                    <span>About</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white w-full absolute bottom-0 left-0 right-0">
          <p className="my-1">Built by Rival Ravens | AI Research Assistant</p>
        </footer>
      </main>
    </>
  );
}

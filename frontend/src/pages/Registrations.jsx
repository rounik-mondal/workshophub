// src/pages/Registrations.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Registrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get('/registrations');
        setRegistrations(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleUnregister = async (registrationId) => {
    try {
      await api.put(`/registrations/${registrationId}/unregister`);
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === registrationId ? { ...reg, status: 'cancelled' } : reg
        )
      );
      toast.success('Unregistered successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to unregister');
    }
  };

  // Helper to get status badge styling
  const getStatusBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-semibold border ';
    switch (status) {
      case 'registered':
        return base + 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return base + 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return base + 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c1f] via-[#1a1730] to-[#0f0c1f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c1f] via-[#1a1730] to-[#0f0c1f] p-4 sm:p-6 lg:p-8">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
            {user?.role === 'participant'
              ? 'My Registrations'
              : 'Workshop Registrations'}
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
            {user?.role === 'participant'
              ? 'Manage your workshop sign‑ups'
              : 'Overview of all participant registrations'}
          </p>
        </div>

        {/* Registrations Grid */}
        {registrations.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base text-gray-400">No registrations found.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-1" title={reg.workshop?.title}>
                  {reg.workshop?.title || 'Untitled Workshop'}
                </h3>

                <div className="space-y-2 text-sm sm:text-base">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Participant:</span>{' '}
                    <span className="font-medium" title={reg.user?.email}>
                      {reg.user?.name || 'Unknown'}
                    </span>
                  </p>

                  <p className="text-gray-300">
                    <span className="text-gray-400">Status:</span>{' '}
                    <span className={getStatusBadge(reg.status)}>
                      {reg.status}
                    </span>
                  </p>

                  <p className="text-gray-300">
                    <span className="text-gray-400">Registered:</span>{' '}
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {user?.role === 'participant' && reg.status === 'registered' && (
                  <button
                    onClick={() => handleUnregister(reg._id)}
                    className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:shadow-red-500/30 transform hover:scale-[1.02] transition duration-200"
                  >
                    Unregister
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
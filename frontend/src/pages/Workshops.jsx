// src/pages/Workshops.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await api.get('/workshops');
        setWorkshops(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load workshops');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
              Workshops
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1">
              Explore and register for upcoming workshops
            </p>
          </div>

          {user?.role === 'admin' && (
            <Link
              to="/workshops/create"
              className="px-5 py-3 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-gold/20 transform hover:scale-105 transition duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Workshop
            </Link>
          )}
        </div>

        {/* Workshops Grid */}
        {workshops.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base text-gray-400">No workshops available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workshops.map((ws) => (
              <Link
                key={ws._id}
                to={`/workshops/${ws._id}`}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-gold transition-colors" title={ws.title}>
                  {ws.title}
                </h3>

                <div className="space-y-2 text-sm sm:text-base">
                  <p className="text-gray-300 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {ws.venue || 'TBA'}
                  </p>

                  <p className="text-gray-300 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {ws.instructor?.name || 'TBA'}
                  </p>

                  <p className="text-gray-300 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(ws.date)}
                  </p>

                  <p className="text-gray-300 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {ws.time}
                  </p>
                </div>

                {/* Optional: show seats available? Could be added if API provides registration count */}
                {/* <div className="mt-3 text-xs text-gold">
                  {ws.availableSeats} seats left
                </div> */}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
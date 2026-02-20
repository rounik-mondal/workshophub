// src/pages/WorkshopDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function WorkshopDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const res = await api.get(`/workshops/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load workshop details');
        navigate('/workshops');
      }
    };
    fetchWorkshop();
  }, [id, navigate]);

  if (!data) return null;

  const { workshop, registrations } = data;

  const deleteWorkshop = async () => {
    if (!window.confirm('Delete this workshop?')) return;
    try {
      await api.delete(`/workshops/${id}`);
      toast.success('Workshop deleted successfully');
      navigate('/workshops');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete workshop');
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      setMessage('');

      await api.post('/registrations', {
        workshopId: id,
      });

      toast.success('Successfully registered for this workshop!');
      // Refresh data to update registration count
      const res = await api.get(`/workshops/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c1f] via-[#1a1730] to-[#0f0c1f] p-4 sm:p-6 lg:p-8 flex items-start justify-center">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Glass card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8">
          {/* Header with title and back link */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link
              to="/workshops"
              className="text-gold hover:text-amber-300 transition-colors flex items-center gap-1 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Workshops
            </Link>
            <span className="text-xs sm:text-sm px-3 py-1 bg-gold/10 text-gold border border-gold/30 rounded-full">
              {registrations} / {workshop.seats} registered
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent mb-4">
            {workshop.title}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
            {workshop.description}
          </p>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Date</span>
                <span className="text-white font-medium">
                  {new Date(workshop.date).toDateString()}
                </span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Time</span>
                <span className="text-white font-medium">{workshop.time}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Venue</span>
                <span className="text-white font-medium">{workshop.venue}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Total Seats</span>
                <span className="text-white font-medium">{workshop.seats}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Available Seats</span>
                <span className="text-white font-medium">{workshop.seats - registrations}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Instructor</span>
                <span className="text-white font-medium">{workshop.instructor?.name || 'TBA'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {user?.role === 'admin' && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-white/10">
              <Link
                to={`/workshops/edit/${id}`}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-semibold text-center rounded-lg hover:shadow-gold/20 transform hover:scale-[1.02] transition duration-200"
              >
                Edit Workshop
              </Link>
              <button
                onClick={deleteWorkshop}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-red-500/30 transform hover:scale-[1.02] transition duration-200"
              >
                Delete Workshop
              </button>
            </div>
          )}

          {user?.role === 'participant' && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={handleRegister}
                disabled={registering}
                className="w-full py-4 px-5 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-gold/20 transform hover:scale-[1.02] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register for Workshop'
                )}
              </button>

              {message && (
                <p className={`mt-3 text-sm text-center ${
                  message.includes('Success') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
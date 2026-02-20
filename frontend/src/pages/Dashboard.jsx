// src/pages/Dashboard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  // Helper to get card color based on purpose (for the icon background)
  const getIconColor = (type) => {
    const colors = {
      workshops: 'from-blue-500 to-cyan-500',
      create: 'from-green-500 to-emerald-500',
      certificates: 'from-purple-500 to-pink-500',
      registrations: 'from-indigo-500 to-purple-500',
      feedback: 'from-yellow-500 to-amber-500',
      attendance: 'from-orange-500 to-red-500',
    };
    return colors[type] || 'from-gold to-amber-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c1f] via-[#1a1730] to-[#0f0c1f] p-4 sm:p-6 lg:p-8">
      {/* Decorative background blobs (optional) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-2">
            <span className="bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
              Welcome, {user.name}!
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg flex items-center gap-2">
            <span>Role:</span>
            <span className="px-3 py-1 text-sm font-semibold bg-gold/10 text-gold border border-gold/30 rounded-full">
              {user.role}
            </span>
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
          {/* Workshops - always visible */}
          <Link
            to="/workshops"
            className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
          >
            <div className="flex flex-col h-full">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconColor('workshops')} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                Workshops
              </h3>
              <p className="text-gray-400 text-sm flex-1">
                Browse and manage workshop sessions
              </p>
            </div>
          </Link>

          {/* Admin: Create Workshop */}
          {user.role === 'admin' && (
            <Link
              to="/workshops/create"
              className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
            >
              <div className="flex flex-col h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconColor('create')} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-xl">+</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                  Create Workshop
                </h3>
                <p className="text-gray-400 text-sm flex-1">
                  Add new workshop sessions
                </p>
              </div>
            </Link>
          )}

          {/* Participant specific cards */}
          {user.role === 'participant' && (
            <>
              <Link
                to="/certificates"
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
              >
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconColor('certificates')} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                    My Certificates
                  </h3>
                  <p className="text-gray-400 text-sm flex-1">
                    View your earned certificates
                  </p>
                </div>
              </Link>

              <Link
                to="/registrations"
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
              >
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconColor('registrations')} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">R</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                    My Registrations
                  </h3>
                  <p className="text-gray-400 text-sm flex-1">
                    View and manage your workshop registrations
                  </p>
                </div>
              </Link>

              <Link
                to="/feedback"
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
              >
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconColor('feedback')} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                    Submit Feedback
                  </h3>
                  <p className="text-gray-400 text-sm flex-1">
                    Share your workshop experience
                  </p>
                </div>
              </Link>
            </>
          )}

          {/* Instructor/Admin shared cards */}
          {(user.role === 'instructor' || user.role === 'admin') && (
            <>
              <Link
                to="/attendance"
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
              >
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconColor('attendance')} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                    Manage Attendance
                  </h3>
                  <p className="text-gray-400 text-sm flex-1">
                    Track participant attendance
                  </p>
                </div>
              </Link>

              <Link
                to="/feedback"
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5"
              >
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getIconColor('feedback')} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                    View Feedback
                  </h3>
                  <p className="text-gray-400 text-sm flex-1">
                    Review participant feedback
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
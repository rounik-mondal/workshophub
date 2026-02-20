// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setIsMenuOpen(false); // close menu on logout
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Navigation links based on user role
  const getLinks = () => {
    if (!user) return null;

    const commonLinks = [
      { to: '/workshops', label: 'Workshops' },
      { to: '/registrations', label: 'Registrations' },
      { to: '/materials', label: 'Materials' },
      { to: '/feedback', label: 'Feedback' },
      { to: '/certificates', label: 'Certificates' },
    ];

    const instructorLinks = [
      ...commonLinks,
      { to: '/attendance', label: 'Attendance' },
    ];

    return user.role === 'participant' ? commonLinks : instructorLinks;
  };

  const links = getLinks();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-serif font-bold bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            WorkshopHub
          </Link>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {user ? (
              <>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-300 hover:text-gold transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-gradient-to-r from-gold to-amber-400 rounded-lg hover:shadow-gold/20 transform hover:scale-105 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 border border-gold/30 rounded-lg hover:bg-gold/10 hover:border-gold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-gradient-to-r from-gold to-amber-400 rounded-lg hover:shadow-gold/20 transform hover:scale-105 transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-gold focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (slide-down) */}
      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-black/30 border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-gray-300 hover:text-gold transition-colors font-medium py-2"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-900 bg-gradient-to-r from-gold to-amber-400 rounded-lg hover:shadow-gold/20 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm font-medium text-gray-300 border border-gold/30 rounded-lg hover:bg-gold/10 hover:border-gold transition-colors"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-sm font-medium text-gray-900 bg-gradient-to-r from-gold to-amber-400 rounded-lg hover:shadow-gold/20 transition duration-200"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
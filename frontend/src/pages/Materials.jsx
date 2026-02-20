// src/pages/Materials.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Materials() {
  const { user } = useAuth();

  const [materials, setMaterials] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [workshop, setWorkshop] = useState('');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  // Fetch workshops for dropdowns
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await api.get('/workshops');
        setWorkshops(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load workshops');
      }
    };
    fetchWorkshops();
  }, []);

  // Load materials
  const loadMaterials = async (workshopId = '') => {
    setLoading(true);
    try {
      const res = await api.get(
        workshopId ? `/materials?workshop=${workshopId}` : '/materials'
      );
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const addMaterial = async (e) => {
    e.preventDefault();
    try {
      await api.post('/materials', {
        workshop,
        title,
        file_url: fileUrl,
      });

      toast.success('Material added successfully');

      setTitle('');
      setFileUrl('');
      setWorkshop('');

      loadMaterials();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error adding material');
    }
  };

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
            Workshop Materials
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
            {user?.role === 'admin' || user?.role === 'instructor'
              ? 'Manage and share workshop materials'
              : 'Access workshop resources'}
          </p>
        </div>

        {/* Add Material Form (Admin/Instructor only) */}
        {(user?.role === 'admin' || user?.role === 'instructor') && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 w-full max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
              Add New Material
            </h2>

            <form onSubmit={addMaterial} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 tracking-wide">
                  Select Workshop
                </label>
                <select
                  value={workshop}
                  onChange={(e) => setWorkshop(e.target.value)}
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23FFD700'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.2em',
                  }}
                >
                  <option value="" className="bg-[#1a1730] text-white">
                    Choose a workshop...
                  </option>
                  {workshops.map((w) => (
                    <option key={w._id} value={w._id} className="bg-[#1a1730] text-white">
                      {w.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 tracking-wide">
                  Material Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Workshop Slides"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 tracking-wide">
                  File URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/material.pdf"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 sm:py-4 px-4 sm:px-5 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-gold/20 transform hover:scale-[1.02] transition duration-200"
              >
                Add Material
              </button>
            </form>
          </div>
        )}

        {/* Filter */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
            Filter Materials
          </h2>
          <div className="w-full max-w-md">
            <select
              onChange={(e) => loadMaterials(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300 appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23FFD700'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.2em',
              }}
            >
              <option value="" className="bg-[#1a1730] text-white">
                All Workshops
              </option>
              {workshops.map((w) => (
                <option key={w._id} value={w._id} className="bg-[#1a1730] text-white">
                  {w.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Materials Table */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
          ) : materials.length === 0 ? (
            <div className="p-6 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-gray-400">No materials found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] sm:min-w-full">
                <thead>
                  <tr className="bg-gold/20">
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gold">
                      Title
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gold">
                      Workshop
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gold">
                      Uploaded By
                    </th>
                    <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {materials.map((m) => (
                    <tr key={m._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-300 max-w-[150px] sm:max-w-xs truncate" title={m.title || 'Material'}>
                        {m.title || 'Material'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-300 max-w-[150px] sm:max-w-xs truncate" title={m.workshop?.title || 'N/A'}>
                        {m.workshop?.title || 'N/A'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-300 max-w-[120px] sm:max-w-xs truncate" title={m.uploaded_by?.name || 'Unknown'}>
                        {m.uploaded_by?.name || 'Unknown'}
                      </td>
                      <td className="px-3 sm:px-4 py-3 sm:py-4">
                        <a
                          href={m.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-medium text-xs sm:text-sm rounded-lg hover:shadow-gold/20 transform hover:scale-105 transition duration-200"
                        >
                          Open
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
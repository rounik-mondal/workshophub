// src/pages/Certificates.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Certificates() {
  const { user } = useAuth();

  const [certificates, setCertificates] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [workshop, setWorkshop] = useState('');
  const [userId, setUserId] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const res = await api.get('/certificates');
        setCertificates(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  // Fetch workshops and users for admin
  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchAdminData = async () => {
      try {
        const [workshopsRes, usersRes] = await Promise.all([
          api.get('/workshops'),
          api.get('/users'),
        ]);
        setWorkshops(workshopsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load workshops or users');
      }
    };
    fetchAdminData();
  }, [user]);

  const issueCertificate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/certificates', {
        workshop,
        userId,
        certificate_url: certificateUrl,
      });
      toast.success('Certificate issued successfully');

      // Refresh certificates list
      const res = await api.get('/certificates');
      setCertificates(res.data);

      // Reset form
      setWorkshop('');
      setUserId('');
      setCertificateUrl('');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error issuing certificate');
    }
  };

  const downloadCertificate = (id) => {
    window.open(
      `http://localhost:8000/api/certificates/download/${id}`,
      '_blank'
    );
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
            Certificates
          </h1>
          <p className="text-gray-400 mt-2">
            {user?.role === 'admin'
              ? 'Issue and manage certificates'
              : 'View your earned certificates'}
          </p>
        </div>

        {/* Admin Issue Certificate Form */}
        {user?.role === 'admin' && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Issue New Certificate</h2>
            <form onSubmit={issueCertificate} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                  Workshop
                </label>
                <select
                  value={workshop}
                  onChange={(e) => setWorkshop(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23FFD700'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em',
                  }}
                >
                  <option value="" className="bg-[#1a1730] text-white">Select a workshop</option>
                  {workshops.map((w) => (
                    <option key={w._id} value={w._id} className="bg-[#1a1730] text-white">
                      {w.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                  User
                </label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23FFD700'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em',
                  }}
                >
                  <option value="" className="bg-[#1a1730] text-white">Select a user</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id} className="bg-[#1a1730] text-white">
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                  Certificate URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/certificate.pdf"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-gold/20 transform hover:scale-105 transition duration-200"
              >
                Issue Certificate
              </button>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        )}

        {/* Certificates Table */}
        {!loading && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {certificates.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg">No certificates found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gold/20">
                      <th className="px-4 py-4 text-left text-gold font-semibold">Workshop</th>
                      <th className="px-4 py-4 text-left text-gold font-semibold">User</th>
                      <th className="px-4 py-4 text-left text-gold font-semibold">Issued Date</th>
                      <th className="px-4 py-4 text-left text-gold font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {certificates.map((cert) => (
                      <tr key={cert._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 text-gray-300">
                          {cert.workshop?.title || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {cert.user?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-gray-300">
                          {new Date(cert.issued_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => downloadCertificate(cert._id)}
                            className="px-4 py-2 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-medium rounded-lg hover:shadow-gold/20 transform hover:scale-105 transition duration-200"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// src/pages/Attendance.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch workshops based on role
  useEffect(() => {
    if (!user) return;
    const fetchWorkshops = async () => {
      setLoading(true);
      try {
        let res;
        if (user.role === 'instructor') {
          res = await api.get('/workshops/my');
        } else {
          res = await api.get('/workshops');
        }
        setWorkshops(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load workshops');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, [user]);

  // Fetch registrations and attendance when workshop selected
  useEffect(() => {
    if (!selectedWorkshop) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [regRes, attRes] = await Promise.all([
          api.get(`/registrations?workshop=${selectedWorkshop}`),
          api.get(`/attendance/workshop/${selectedWorkshop}`),
        ]);
        setRegistrations(regRes.data);
        setAttendance(attRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedWorkshop]);

  const getAttendanceForReg = (regId) => {
    return attendance.find(
      (a) => a.registration?._id === regId || a.registration === regId
    );
  };

  const toggleAttendance = async (regId, current) => {
    try {
      const res = await api.post('/attendance/mark', {
        registrationId: regId,
        attended: !current,
      });

      setAttendance((prev) => {
        const exists = prev.find((a) => a._id === res.data._id);
        if (exists) {
          return prev.map((a) => (a._id === res.data._id ? res.data : a));
        }
        return [...prev, res.data];
      });

      toast.success(`Marked as ${!current ? 'present' : 'absent'}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error marking attendance');
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
            Manage Attendance
          </h1>
          <p className="text-gray-400 mt-2">
            Select a workshop to mark participant attendance
          </p>
        </div>

        {/* Workshop Selector */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
            Choose Workshop
          </label>
          <select
            value={selectedWorkshop}
            onChange={(e) => setSelectedWorkshop(e.target.value)}
            className="w-full md:w-96 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23FFD700'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5em',
            }}
          >
            <option value="" className="bg-[#1a1730] text-white">
              Select a workshop
            </option>
            {workshops.map((w) => (
              <option key={w._id} value={w._id} className="bg-[#1a1730] text-white">
                {w.title}
              </option>
            ))}
          </select>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        )}

        {/* No selection message */}
        {!loading && !selectedWorkshop && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">Please select a workshop to view registrations.</p>
          </div>
        )}

        {/* No registrations message */}
        {!loading && selectedWorkshop && registrations.length === 0 && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">No registrations found for this workshop.</p>
          </div>
        )}

        {/* Attendance Table */}
        {!loading && registrations.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gold/20">
                    <th className="px-4 py-4 text-left text-gold font-semibold">Name</th>
                    <th className="px-4 py-4 text-left text-gold font-semibold">Email</th>
                    <th className="px-4 py-4 text-left text-gold font-semibold">Status</th>
                    <th className="px-4 py-4 text-left text-gold font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrations.map((reg) => {
                    const att = getAttendanceForReg(reg._id);
                    const attended = att?.attended || false;

                    return (
                      <tr key={reg._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 text-gray-300">{reg.user.name}</td>
                        <td className="px-4 py-4 text-gray-300">{reg.user.email}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              attended
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {attended ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleAttendance(reg._id, attended)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                              attended
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-red-500/30'
                                : 'bg-gradient-to-r from-gold to-amber-400 text-gray-900 hover:shadow-gold/20'
                            }`}
                          >
                            Mark {attended ? 'Absent' : 'Present'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
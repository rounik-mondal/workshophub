// src/pages/CreateWorkshop.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CreateWorkshop() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);

  // ✅ fetch instructors
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await api.get('/users?role=instructor');
        setInstructors(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load instructors');
      }
    };

    fetchInstructors();
  }, []);

  // Access denied
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c1f] via-[#1a1730] to-[#0f0c1f] flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-lg">
            Access denied. Admin privileges required.
          </p>
        </div>
      </div>
    );
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    seats: '',
    instructor: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.instructor) {
      toast.error('Please select an instructor');
      return;
    }

    setLoading(true);
    try {
      await api.post('/workshops', form);
      toast.success('Workshop created successfully!');
      navigate('/workshops');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create workshop');
    } finally {
      setLoading(false);
    }
  };

  // Field configuration (WITHOUT instructor)
  const fields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g., Advanced React Workshop' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Brief description of the workshop' },
    { name: 'date', label: 'Date', type: 'date', placeholder: '' },
    { name: 'time', label: 'Time', type: 'time', placeholder: '' },
    { name: 'venue', label: 'Venue', type: 'text', placeholder: 'e.g., Online / Room 101' },
    { name: 'seats', label: 'Seats', type: 'number', placeholder: 'e.g., 30' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c1f] via-[#1a1730] to-[#0f0c1f] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">
              Create Workshop
            </h1>
            <p className="text-gray-400 mt-2">
              Fill in the details to add a new workshop
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300"
                  min={field.type === 'number' ? '0' : undefined}
                />
              </div>
            ))}

            {/* ✅ Instructor Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                Instructor
              </label>
              <select
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="">Select instructor</option>
                {instructors.map((inst) => (
                  <option key={inst._id} value={inst._id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-5 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-gold/20 transform hover:scale-[1.02] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Workshop'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
// src/pages/Feedback.jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Feedback() {
    const { user } = useAuth();

    const [workshops, setWorkshops] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Participant form state
    const [workshop, setWorkshop] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

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

    // Load feedbacks for admin/instructor
    const loadFeedback = async (workshopId = '') => {
        setLoading(true);
        try {
            const res = await api.get(
                workshopId ? `/feedback?workshop=${workshopId}` : '/feedback'
            );
            setFeedbacks(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load feedback');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'instructor') {
            loadFeedback();
        }
    }, [user]);

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            await api.post('/feedback', {
                workshop,
                rating,
                comment,
            });

            toast.success('Feedback submitted successfully');

            setWorkshop('');
            setRating('');
            setComment('');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error submitting feedback');
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
                        Feedback
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {user?.role === 'participant'
                            ? 'Share your workshop experience'
                            : 'Review participant feedback'}
                    </p>
                </div>

                {/* Participant: Submit Feedback */}
                {user?.role === 'participant' && (
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Submit Workshop Feedback</h2>
                        <form onSubmit={submitFeedback} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                                    Select Workshop
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
                                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                                    Rating (1-5 stars)
                                </label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300 appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23FFD700'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 1rem center',
                                        backgroundSize: '1.5em',
                                    }}
                                >
                                    <option value="" className="bg-[#1a1730] text-white">
                                        Select rating...
                                    </option>
                                    {[1, 2, 3, 4, 5].map((r) => (
                                        <option key={r} value={r} className="bg-[#1a1730] text-white">
                                            {'⭐'.repeat(r)} ({r} star{r > 1 ? 's' : ''})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
                                    Comment (Optional)
                                </label>
                                <textarea
                                    placeholder="Share your thoughts about the workshop..."
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300 resize-none h-32"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 px-5 bg-gradient-to-r from-gold to-amber-400 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-gold/20 transform hover:scale-[1.02] transition duration-200"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                )}

                {/* Admin/Instructor: Filter & Feedback Table */}
                {(user?.role === 'admin' || user?.role === 'instructor') && (
                    <>
                        {/* Filter */}
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4">Filter Feedback</h2>
                            <div className="max-w-md">
                                <select
                                    onChange={(e) => loadFeedback(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition duration-300 appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%23FFD700'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 1rem center',
                                        backgroundSize: '1.5em',
                                    }}
                                >
                                    <option value="" className="bg-[#1a1730] text-white">
                                        All Workshops
                                    </option>
                                    {workshops
                                        .filter(
                                            (w) =>
                                                user.role === 'admin' || w.instructor?._id === user.id
                                        )
                                        .map((w) => (
                                            <option key={w._id} value={w._id} className="bg-[#1a1730] text-white">
                                                {w.title}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        {/* Feedback Table */}
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                                </div>
                            ) : feedbacks.length === 0 ? (
                                <div className="p-12 text-center">
                                    <p className="text-gray-400 text-lg">No feedback found for the selected criteria.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gold/20">
                                                <th className="px-4 py-4 text-left text-gold font-semibold">Workshop</th>
                                                <th className="px-4 py-4 text-left text-gold font-semibold">Participant</th>
                                                <th className="px-4 py-4 text-left text-gold font-semibold">Rating</th>
                                                <th className="px-4 py-4 text-left text-gold font-semibold">Comment</th>
                                                <th className="px-4 py-4 text-left text-gold font-semibold">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {feedbacks.map((f) => (
                                                <tr key={f._id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-4 text-gray-300">{f.workshop?.title}</td>
                                                    <td className="px-4 py-4 text-gray-300">{f.user?.name}</td>
                                                    <td className="px-4 py-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold/20 text-gold border border-gold/30">
                                                            {'⭐'.repeat(f.rating)} ({f.rating})
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-gray-300 max-w-xs truncate" title={f.comment || 'No comment'}>
                                                        {f.comment || <span className="text-gray-500 italic">No comment</span>}
                                                    </td>
                                                    <td className="px-4 py-4 text-gray-300">
                                                        {new Date(f.createdAt).toLocaleDateString()}
                                                        {/* new Date(workshop.date).toISOString().split('T')[0] */}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
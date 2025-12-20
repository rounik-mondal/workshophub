import {useEffect, useState} from 'react';
import api from '../api/axios';
import {useAuth} from '../context/AuthContext';

export default function Feedback() {
    const {user} = useAuth();

    const [workshops, setWorkshops] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);

    const [workshop, setWorkshop] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        api.get('/workshops')
            .then(res => setWorkshops(res.data))
            .catch(err => console.error(err));
    }, []);

    const loadFeedback = async (workshopId = '') => {
        try {
            const res = await api.get(
                workshopId ? `/feedback?workshop=${workshopId}` : '/feedback'
            );
            setFeedbacks(res.data);
        } catch (err) {
            console.error(err);
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
                comment
            });

            alert("Feedback submitted successfully");

            setWorkshop('');
            setRating('');
            setComment('');
        } catch (err) {
            console.error(err);
            alert("Error submitting feedback");
        }
    };

    return (
        <div className='min-h-screen bg-gray-900 p-6'>
            <div className='max-w-6xl mx-auto'>
                <h1 className='text-3xl font-bold mb-8 text-gray-100'>Feedback Management</h1>

                {user?.role === 'participant' && (
                    <div className='card mb-8 max-w-lg'>
                        <h2 className='text-xl font-semibold mb-6 text-gray-100'>Submit Workshop Feedback</h2>

                        <form onSubmit={submitFeedback} className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    Select Workshop
                                </label>
                                <select
                                    className='input w-full'
                                    value={workshop}
                                    onChange={e => setWorkshop(e.target.value)}
                                    required
                                >
                                    <option value=''>Choose a workshop...</option>
                                    {workshops.map(w => (
                                        <option key={w._id} value={w._id}>
                                            {w.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    Rating (1-5 stars)
                                </label>
                                <select
                                    className='input w-full'
                                    value={rating}
                                    onChange={e => setRating(e.target.value)}
                                    required
                                >
                                    <option value=''>Select rating...</option>
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <option key={r} value={r}>
                                            {'⭐'.repeat(r)} ({r} star{r > 1 ? 's' : ''})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    Comment (Optional)
                                </label>
                                <textarea
                                    placeholder="Share your thoughts about the workshop..."
                                    className='input w-full h-24 resize-none'
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                            </div>

                            <button type='submit' className='btn-primary w-full'>
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                )}

                {(user?.role === 'admin' || user?.role === 'instructor') && (
                    <>
                        <div className='card mb-6'>
                            <h2 className='text-xl font-semibold mb-4 text-gray-100'>Filter Feedback</h2>
                            <div className='max-w-md'>
                                <select
                                    className='input w-full'
                                    onChange={e => loadFeedback(e.target.value)}
                                >
                                    <option value=''>All Workshops</option>
                                    {workshops.filter(w => user.role === 'admin' || w.instructor?._id === user.id).map(w => (
                                        <option key={w._id} value={w._id}>
                                          {w.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='card'>
                            <h2 className='text-xl font-semibold mb-6 text-gray-100'>Feedback Overview</h2>
                            <div className='overflow-x-auto'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Workshop</th>
                                            <th>Participant</th>
                                            <th>Rating</th>
                                            <th>Comment</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feedbacks.map(f => (
                                            <tr key={f._id} className='hover:bg-gray-700 transition-colors duration-200'>
                                                <td className='font-medium text-gray-100'>{f.workshop?.title}</td>
                                                <td className='text-gray-300'>{f.user?.name}</td>
                                                <td>
                                                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200'>
                                                        {'⭐'.repeat(f.rating)} ({f.rating})
                                                    </span>
                                                </td>
                                                <td className='text-gray-300 max-w-xs truncate' title={f.comment || 'No comment'}>
                                                    {f.comment || <span className='text-gray-500 italic'>No comment</span>}
                                                </td>
                                                <td className='text-gray-400 text-sm'>
                                                    {new Date(f.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {feedbacks.length === 0 && (
                                <div className='text-center py-8 text-gray-400'>
                                    No feedback found for the selected criteria.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
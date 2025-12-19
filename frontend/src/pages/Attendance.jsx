import {useEffect, useState} from 'react';
import api from '../api/axios';

export default function Attendance() {
    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshop, setSelectedWorkshop] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        api.get('/workshops')
            .then(res => setWorkshops(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (!selectedWorkshop) return;

        api.get(`/registrations?workshop=${selectedWorkshop}`)
            .then(res => setRegistrations(res.data));

        api.get(`/attendance/workshop/${selectedWorkshop}`)
            .then(res => setAttendance(res.data));
    }, [selectedWorkshop]);

    const getAttendanceForReg = (regId) => {
        return attendance.find(a => a.registration?._id === regId);
    };

    const toggleAttendance = async (regId, current) => {
        try {
            const res = await api.post('/attendance/mark', {
                registrationId: regId,
                attended: !current
            });

            setAttendance(prev => {
                const exists = prev.find(a => a._id === res.data._id);
                if (exists) {
                    return prev.map(a => a._id === res.data._id ? res.data : a);
                }
                return [...prev, res.data];
            });
        } catch (err) {
            console.error(err);
            alert("Error marking attendance");
        }
    };

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-semibold mb-4'>Manage Attendance</h1>

            <select
                className='border p-2 mb-6 w-full max-w-md'
                value={selectedWorkshop}
                onChange={e => setSelectedWorkshop(e.target.value)}
            >
                <option value=''>Select Workshop</option>
                {workshops.map(w => (
                    <option key={w._id} value={w._id}>
                        {w.title}
                    </option>
                ))}
            </select>

            {!selectedWorkshop && (
                <p className='text-gray-500'>Please select a workshop.</p>
            )}

            {selectedWorkshop && registrations.length === 0 && (
                <p className='text-gray-500'>No registrations yet.</p>
            )}

            {registrations.length > 0 && (
                <table className='w-full border'>
                    <thead>
                        <tr className='bg-gray-100'>
                            <th className='border p-2'>Name</th>
                            <th className='border p-2'>Email</th>
                            <th className='border p-2'>Status</th>
                            <th className='border p-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map(reg => {
                            const att = getAttendanceForReg(reg._id);
                            const attended = att?.attended || false;

                            return (
                                <tr key={reg._id}>
                                    <td className='border p-2'>{reg.user.name}</td>
                                    <td className='border p-2'>{reg.user.email}</td>
                                    <td className='border p-2'>
                                        {attended ? 'Present' : 'Absent'}
                                    </td>
                                    <td className='border p-2'>
                                        <button
                                            className='border px-3 py-1 rounded'
                                            onClick={() => toggleAttendance(reg._id, attended)}
                                        >
                                            Mark {attended ? "Absent" : "Present"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
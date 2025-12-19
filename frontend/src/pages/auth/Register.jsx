import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';

export default function Register() {
    const {signup} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'participant'
    });

    const submit = async (e) => {
        e.preventDefault();
        await signup(form);
        navigate('/login');
    };

    return (
        <form onSubmit={submit} className='p-8 max-w-md mx-auto space-y-3'>

            <input
                placeholder="Name"
                className='input'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
                placeholder="Email"
                className='input'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
                type='password'
                placeholder="Password"
                className='input'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className='border p-2 w-full rounded'
            >
                <option value='participant'>Participant</option>
                <option value='instructor'>Instructor</option>
            </select>

            <button className='btn w-full'>
                Register
            </button>

        </form>
    );
}
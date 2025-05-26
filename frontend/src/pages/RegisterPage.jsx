import { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/posts');
    } catch (err) {
      alert('Sikertelen regisztráció');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Regisztráció</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Név"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Jelszó"
          type="password"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Regisztráció
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Már van fiókod?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Jelentkezz be
        </Link>
      </p>
    </div>
  );
}

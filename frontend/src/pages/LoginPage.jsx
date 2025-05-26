import { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/posts');
    } catch (err) {
      alert('Sikertelen bejelentkezés');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Bejelentkezés</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Bejelentkezés
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Még nincs fiókod?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Regisztrálj most
        </Link>
      </p>
    </div>
  );
}

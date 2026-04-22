import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(formData.email, formData.password);
      } else {
        response = await authAPI.register(formData.email, formData.password, formData.username);
        if (response.status === 201) {
          setIsLogin(true);
          setFormData({ email: '', password: '', username: '' });
          alert('Registration successful! Please login.');
          setLoading(false);
          return;
        }
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Movie<span className="text-[#b20710]">Flix</span>
        </h1>
        <p className="text-gray-400 text-center mb-8">{isLogin ? 'Sign In' : 'Sign Up'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-700 bg-gray-800 px-4 py-2 outline-none focus:border-[#b20710]"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded border border-gray-700 bg-gray-800 px-4 py-2 outline-none focus:border-[#b20710]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded border border-gray-700 bg-gray-800 px-4 py-2 outline-none focus:border-[#b20710]"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded bg-[#b20710] py-2 font-bold transition hover:bg-[#8f0610] disabled:bg-gray-600"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-gray-400 hover:text-white mt-4 text-sm"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
}

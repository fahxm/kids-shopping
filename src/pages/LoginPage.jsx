import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const data = await login(email, password);
        console.log("Login User Data:", data); // Debugging
        if (data && (data.role === 'admin' || data.isAdmin)) {
          console.log("Redirecting to Admin Dashboard");
          navigate('/admin', { replace: true });
        } else {
          navigate(redirect, { replace: true });
        }
      } else {
        await signup(name, email, password);
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center font-bold">{error}</div>}

        {!isLogin && <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border rounded-xl" />}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border rounded-xl" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border rounded-xl" />

        <button type="submit" className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition">{isLogin ? 'Login' : 'Join'}</button>
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="w-full text-blue-500">{isLogin ? 'Need account?' : 'Have account?'}</button>
      </form>
    </div>
  );
};

export default LoginPage;

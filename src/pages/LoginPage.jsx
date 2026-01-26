import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, isLogin ? 'Kid Explorer' : name);
    navigate(redirect);
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
        {!isLogin && <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-xl" />}
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-xl" />
        <button type="submit" className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl">{isLogin ? 'Login' : 'Join'}</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-blue-500">{isLogin ? 'Need account?' : 'Have account?'}</button>
      </form>
    </div>
  );
};

export default LoginPage;

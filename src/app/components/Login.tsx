import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里可以添加验证逻辑
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/600x400?text=Smart+Charts+Kit')" }}>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl mb-4">登录</h1>
        <input 
          type="text" 
          placeholder="用户名" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className="block w-full p-2 mb-2 border rounded"
        />
        <input 
          type="password" 
          placeholder="密码" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="block w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          登录
        </button>
      </form>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Erro ao cadastrar');
        setLoading(false);
        return;
      }
      // Após cadastro, já faz login automático
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError('Cadastro realizado, mas erro ao fazer login automático');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', loginData.token);
      window.location.href = '/';
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-center">Crie sua conta</h2>
          <p className="text-gray-500 mb-8 text-center">Digite seus dados para se cadastrar</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded font-semibold hover:bg-gray-900 transition"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-gray-600">Já tem uma conta? </span>
            <a href="/" className="font-semibold text-black hover:underline">Entrar</a>
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-1/2 bg-black relative items-center justify-center">
        <img
          src="/login-background.jpg"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-white text-center px-8">
          <p className="text-2xl md:text-3xl font-semibold mb-4">
            "Este dashboard financeiro me ajudou a economizar incontáveis horas de trabalho e me permitiu gerenciar minhas finanças de forma muito mais eficiente."
          </p>
          <span className="block text-lg">— Wesley Ferreira</span>
        </div>
      </div>
    </div>
  );
};

export default Register; 
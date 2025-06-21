import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Erro ao fazer login');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-center">Entre na sua conta</h2>
          <p className="text-gray-500 mb-8 text-center">Digite seu email abaixo para fazer login</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.41m-1.32 1.32A3 3 0 019 12c0-.512.13-.995.36-1.41" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded font-semibold hover:bg-gray-900 transition"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <div className="text-center mt-4">
            <span className="text-gray-600">Não tem uma conta? </span>
            <a href="/register" className="font-semibold text-black hover:underline">Cadastre-se</a>
          </div>
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-4 text-gray-400">Ou continue com</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded hover:bg-gray-50 transition">
            <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_17_40)">
                <path d="M47.9999 24.552C47.9999 22.864 47.852 21.232 47.5839 19.68H24.4799V28.932H37.7079C37.1479 31.66 35.4999 33.984 33.0199 35.552V41.048H40.7799C45.0199 37.16 47.9999 31.432 47.9999 24.552Z" fill="#4285F4"/>
                <path d="M24.48 48C30.96 48 36.4 45.864 40.78 41.048L33.02 35.552C30.84 37.032 28.04 37.936 24.48 37.936C18.24 37.936 12.88 33.816 10.96 28.272H3.02V33.936C7.44 42.048 15.36 48 24.48 48Z" fill="#34A853"/>
                <path d="M10.96 28.272C10.48 26.792 10.2 25.224 10.2 23.6C10.2 21.976 10.48 20.408 10.96 18.928V13.264H3.02C1.1 16.824 0 20.624 0 24.552C0 28.48 1.1 32.28 3.02 35.84L10.96 28.272Z" fill="#FBBC05"/>
                <path d="M24.48 9.064C28.36 9.064 31.68 10.376 34.16 12.72L40.96 6.072C36.4 1.704 30.96-0.432 24.48-0.432C15.36-0.432 7.44 5.52 3.02 13.264L10.96 18.928C12.88 13.384 18.24 9.064 24.48 9.064Z" fill="#EA4335"/>
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="48" height="48" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Continuar com Google
          </button>
        </div>
      </div>
      {/* Right: Quote Section */}
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

export default Login; 
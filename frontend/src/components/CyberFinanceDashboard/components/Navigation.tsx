import React, { useState, useEffect, useRef } from 'react';
import { User, Zap, LogOut, DollarSign } from 'lucide-react';
import { MenuItem } from '../types';

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

interface UserData {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
}

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  menuItems: MenuItem[];
  currentTime: Date;
  glitchEffect: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  setActiveSection,
  menuItems = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/users/upload-picture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Atualizar user no localStorage e no estado
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        console.error('Falha no upload:', data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }
  };

  const menu = [
    ...menuItems,
    { id: 'recurrences', name: 'Recorrências', icon: DollarSign },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-black flex flex-col items-center py-8 shadow-2xl z-50 transition-all duration-300
        ${expanded ? 'w-56' : 'w-20'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo/User Picture */}
      <div className="mb-10 flex flex-col items-center w-full cursor-pointer" onClick={handlePictureClick}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        {user?.profilePictureUrl ? (
          <img
            src={`${BASE_URL}${user.profilePictureUrl}`}
            alt="User"
            className="h-12 w-12 rounded-2xl object-cover shadow-lg mb-2 mx-auto"
          />
        ) : (
          <div className="p-3 bg-gradient-to-r from-green-400 to-cyan-500 rounded-2xl shadow-lg mb-2 mx-auto">
            <User className="h-7 w-7 text-white" />
          </div>
        )}
        <span className="text-xs text-gray-400 font-bold tracking-widest mx-auto">{user?.name || 'User'}</span>
      </div>
      {/* Menu */}
      <nav className="flex flex-col gap-2 flex-1 w-full items-center">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 w-[90%] mx-auto
                ${isActive ? 'bg-gradient-to-r from-green-400 to-cyan-500 shadow-lg' : 'hover:bg-gray-800'}
              `}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-300'}`} />
              <span
                className={`text-sm font-semibold whitespace-nowrap transition-all duration-200 ${expanded ? 'opacity-100 ml-2' : 'opacity-0 ml-0'} ${isActive ? 'text-white' : 'text-gray-300'}`}
                style={{ width: expanded ? 'auto' : 0, overflow: 'hidden' }}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
      {/* Botão de logout - aparece apenas quando expandido */}
      {expanded && (
        <div className="mt-auto mb-4 w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 w-[90%] mx-auto justify-center"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}; 
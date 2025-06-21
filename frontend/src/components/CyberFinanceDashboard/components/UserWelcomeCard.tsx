import React from 'react';

const UserWelcomeCard: React.FC = () => {
  const user = {
    name: 'Wesley Ferreira',
    avatar: 'https://ui-avatars.com/api/?name=Wesley+Ferreira&background=cyan&color=fff&size=128',
  };

  return (
    <div className="flex items-center gap-4 bg-white bg-opacity-80 shadow-lg rounded-xl p-6 mb-8">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-16 h-16 rounded-full border-4 border-cyan-400 shadow"
      />
      <div>
        <h2 className="text-2xl font-bold text-black mb-1">Olá, {user.name}!</h2>
        <p className="text-gray-600">Bem-vindo de volta ao seu painel financeiro 🚀</p>
      </div>
    </div>
  );
};

export default UserWelcomeCard; 
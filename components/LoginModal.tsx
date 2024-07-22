'use client';

import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement the login logic here
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as Element).classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay" onClick={handleClickOutside}>
      <div className="bg-black p-6 rounded-lg shadow-lg w-full max-w-sm mt-10">
        <h2 className="text-2xl mb-4 text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-white">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-white text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-white text-black"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-orange-200 text-black rounded">
            Login
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-orange-200">
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal;

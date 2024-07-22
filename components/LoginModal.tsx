import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn('credentials', {
      redirect: false,
      usernameOrEmail,
      password,
    });

    if (res?.ok) {
      onClose();
    } else {
      console.error('Error during login:', res);
    }
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
            <label className="block mb-1 text-white">Username or Email</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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

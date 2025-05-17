import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { ForgotPassword } from './ForgotPassword';
import { AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgotPassword'>('login');

  const toggleForm = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const showForgotPassword = () => {
    setAuthMode('forgotPassword');
  };

  const backToLogin = () => {
    setAuthMode('login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Task Manager
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Organize your tasks efficiently and boost your productivity
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AnimatePresence mode="wait">
          {authMode === 'login' && (
            <Login key="login" onToggleForm={toggleForm} onForgotPassword={showForgotPassword} />
          )}
          {authMode === 'register' && (
            <Register key="register" onToggleForm={toggleForm} />
          )}
          {authMode === 'forgotPassword' && (
            <ForgotPassword key="forgotPassword" onBackToLogin={backToLogin} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

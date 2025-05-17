import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const ForgotPassword: React.FC<{ onBackToLogin: () => void }> = ({ onBackToLogin }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Untuk debugging
  console.log('ForgotPassword rendered, isSubmitted:', isSubmitted);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message || 'Failed to send password reset email');
        setError(error.message || 'Failed to send password reset email');
      } else {
        // Tampilkan pesan sukses dan atur state
        toast.success('Password reset email sent successfully');
        // Gunakan callback function untuk memastikan state diperbarui
        setIsSubmitted(() => {
          console.log('Setting isSubmitted to true');
          return true;
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 dark:text-white">
        Reset Your Password
      </h2>

      {isSubmitted ? (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Mail size={48} className="text-green-500" />
          </div>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions.
          </p>
          <Button onClick={onBackToLogin} variant="outline" className="w-full">
            Back to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-600 mb-4 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div>
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              placeholder="your.email@example.com"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send Reset Link
            </Button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

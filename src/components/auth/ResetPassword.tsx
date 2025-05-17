import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if we have a hash in the URL which indicates a password reset
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      // No valid recovery token found, redirect to login
      navigate('/auth');
    }
  }, [navigate]);

  const validateForm = () => {
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Update the user's password
      const { error } = await updatePassword(password);

      if (error) {
        toast.error(error.message || 'Failed to reset password');
        setError(error.message || 'Failed to reset password');
      } else {
        setIsSuccess(true);
        toast.success('Password reset successfully');
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Reset Your Password
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          {isSuccess ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Password Reset Successful
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Your password has been reset successfully. You will be redirected to the login page shortly.
              </p>
              <Button 
                onClick={() => navigate('/auth')} 
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error && password.length === 0 ? error : ''}
                  placeholder="••••••••"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={error && password !== confirmPassword ? error : ''}
                  placeholder="••••••••"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}

              <div>
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="w-full"
                >
                  <Lock size={18} className="mr-2" />
                  Reset Password
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

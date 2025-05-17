import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeleteAccountProps {
  onCancel: () => void;
}

export const DeleteAccount: React.FC<DeleteAccountProps> = ({ onCancel }) => {
  const { deleteAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsLoading(true);
    try {
      const { error, success } = await deleteAccount();
      if (error) {
        toast.error(error.message || 'Failed to delete account');
      } else if (success) {
        toast.success('Account deleted successfully');
        // Redirect will happen automatically due to auth state change
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex items-center mb-4 text-red-500">
        <AlertTriangle className="mr-2" size={24} />
        <h2 className="text-xl font-bold">Delete Account</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          This action is <strong>permanent</strong> and <strong>cannot be undone</strong>. All your data, including tasks and profile information, will be permanently deleted.
        </p>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-4">
          <p className="text-red-700 dark:text-red-300 font-medium">
            To confirm, please type "DELETE" in the field below:
          </p>
        </div>

        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Type DELETE to confirm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button 
          onClick={onCancel} 
          variant="outline"
          className="dark:border-gray-600 dark:text-gray-300"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDeleteAccount} 
          isLoading={isLoading}
          className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          disabled={confirmation !== 'DELETE'}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { User, Settings, LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { DeleteAccount } from './DeleteAccount';

// Profile data structure from Supabase
type ProfileData = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  website: string | null;
}

export const UserProfile: React.FC = () => {
  const { user, signOut, deleteAccount } = useAuth();
  // Profile data is stored in formData state after fetching
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    website: '',
  });

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single<ProfileData>();

      if (error) {
        throw error;
      }

      if (data) {
        setFormData({
          fullName: data.full_name || '',
          username: data.username || '',
          website: data.website || '',
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          username: formData.username,
          website: formData.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
      getProfile();
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <span className="sr-only">Loading profile...</span>
      </div>
    );
  }

  const toggleDeleteAccount = () => {
    setShowDeleteAccount(!showDeleteAccount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      {showDeleteAccount ? (
        <DeleteAccount onCancel={toggleDeleteAccount} />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <User className="mr-2" size={20} />
              User Profile
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <Input
            label="Email"
            type="email"
            value={user?.email || ''}
            disabled
            className="bg-gray-100 dark:bg-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Email cannot be changed
          </p>
        </div>

        <div>
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="johndoe"
          />
        </div>

        <div>
          <Input
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="flex justify-between mt-6">
          <Button type="submit" isLoading={updating} className="w-auto">
            <Settings size={16} className="mr-2" />
            Update Profile
          </Button>
          
          <Button 
            type="button" 
            onClick={toggleDeleteAccount} 
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Account
          </Button>
        </div>
      </form>
    </>
    )}
    </div>
  );
};

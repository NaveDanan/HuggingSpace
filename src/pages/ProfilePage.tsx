import React from 'react';
import { Layout } from '../components/Layout';
import { ProfileForm } from '../components/profile/ProfileForm';
import { UserCircle } from 'lucide-react';

export function ProfilePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <UserCircle className="w-10 h-10 text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">Edit Profile</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Customize your profile information and appearance
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <ProfileForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
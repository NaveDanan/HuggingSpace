import React from 'react';
import { Layout } from '../components/Layout';
import { ViewProfileContent } from '../components/profile/ViewProfileContent';
import { useParams } from 'react-router-dom';

export function ViewProfilePage() {
  const { username } = useParams();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ViewProfileContent username={username!} />
      </div>
    </Layout>
  );
}
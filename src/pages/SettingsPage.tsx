import React from 'react';
import { Layout } from '../components/Layout';
import { SettingsLayout } from '../components/settings/SettingsLayout';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { AccountSettings } from '../components/settings/AccountSettings';
import { AccessTokenSettings } from '../components/settings/AccessTokenSettings';
import { ThemeSettings } from '../components/settings/ThemeSettings';
import { useParams, Navigate } from 'react-router-dom';

export function SettingsPage() {
  const { tab = 'profile' } = useParams();
  
  // Validate tab parameter
  if (!['profile', 'account', 'tokens', 'theme'].includes(tab)) {
    return <Navigate to="/settings/profile" replace />;
  }

  return (
    <Layout>
      <SettingsLayout>
        {tab === 'profile' && <ProfileSettings />}
        {tab === 'account' && <AccountSettings />}
        {tab === 'tokens' && <AccessTokenSettings />}
        {tab === 'theme' && <ThemeSettings />}
      </SettingsLayout>
    </Layout>
  );
}
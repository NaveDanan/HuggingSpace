import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useContent } from '../hooks/useContent';
import { ModelRepositoryLayout } from '../components/repository/ModelRepositoryLayout';
import { useState } from 'react';
import { formatModelData } from '../utils/modelFormatters';
import { ModelMetadata } from '../components/model/ModelMetadata';
import { useRepositoryState } from '../hooks/useRepositoryState';

const REPOSITORY_FILES = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      { name: 'model.py', type: 'file', path: 'src/model.py', size: 1024 * 50 },
      { name: 'utils.py', type: 'file', path: 'src/utils.py', size: 1024 * 15 },
    ],
  },
  {
    name: 'configs',
    type: 'folder',
    path: 'configs',
    children: [
      { name: 'config.yaml', type: 'file', path: 'configs/config.yaml', size: 1024 * 2 },
    ],
  },
  { name: 'README.md', type: 'file', path: 'README.md', size: 1024 * 5 },
  { name: 'requirements.txt', type: 'file', path: 'requirements.txt', size: 512 },
];

export function ContentPage({ type }: { type: 'model' | 'dataset' | 'space' }) {
  const { username, slug } = useParams();
  const [activeTab, setActiveTab] = useState('readme');
  const { content, loading, error } = useContent(type, username!, slug!);
  const { selectedFile, currentPath, handleFileSelect, handlePathChange } = useRepositoryState();

  const model = content ? formatModelData(content) : null;

  return (
    <Layout>
      <ModelRepositoryLayout
        model={model!}
        loading={loading}
        error={error}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </Layout>
  );
}
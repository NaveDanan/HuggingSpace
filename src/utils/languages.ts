// Map file extensions to Monaco editor language IDs
export const FILE_EXTENSION_TO_LANGUAGE: Record<string, string> = {
  // Web
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'scss',
  'less': 'less',
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'json': 'json',
  'jsonc': 'jsonc',
  
  // Config files
  'yml': 'yaml',
  'yaml': 'yaml',
  'toml': 'toml',
  'ini': 'ini',
  'env': 'shell',
  'conf': 'shell',
  
  // Programming languages
  'py': 'python',
  'rb': 'ruby',
  'php': 'php',
  'java': 'java',
  'cs': 'csharp',
  'go': 'go',
  'rs': 'rust',
  'cpp': 'cpp',
  'c': 'c',
  'h': 'cpp',
  'hpp': 'cpp',
  'swift': 'swift',
  'kt': 'kotlin',
  
  // Shell scripts
  'sh': 'shell',
  'bash': 'shell',
  'zsh': 'shell',
  'fish': 'shell',
  
  // Markup
  'md': 'markdown',
  'mdx': 'markdown',
  'tex': 'latex',
  'xml': 'xml',
  'svg': 'xml',
  
  // Data formats
  'csv': 'plaintext',
  'tsv': 'plaintext',
  'sql': 'sql',
  'graphql': 'graphql',
  
  // Others
  'txt': 'plaintext',
  'log': 'plaintext',
  'diff': 'diff',
  'patch': 'diff',
  'Dockerfile': 'dockerfile',
  'dockerignore': 'plaintext',
  'gitignore': 'plaintext',
};

// Get language ID from file path
export function getLanguageFromPath(path: string): string {
  // Handle special filenames
  const filename = path.toLowerCase().split('/').pop() || '';
  if (filename === 'dockerfile') return 'dockerfile';
  if (filename === '.gitignore') return 'plaintext';
  if (filename === '.env') return 'shell';
  
  // Get extension
  const ext = path.split('.').pop()?.toLowerCase() || '';
  return FILE_EXTENSION_TO_LANGUAGE[ext] || 'plaintext';
}
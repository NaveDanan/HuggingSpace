import React from 'react';
import { FileText, Download, Code, FileCode, Save, Copy } from 'lucide-react';
import loader from '@monaco-editor/loader';
import Editor from '@monaco-editor/react';
import { CommitDialog } from './CommitDialog';
import { getLanguageFromPath } from '../../utils/languages';

// Configure Monaco loader
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });

interface FileViewerProps {
  path: string;
  content: string;
  language?: string | null;
  readOnly?: boolean;
  isOwner?: boolean;
  onSave?: (content: string) => Promise<void>;
}

export function FileViewer({ 
  path, 
  content, 
  language, 
  readOnly = true,
  isOwner = false,
  onSave 
}: FileViewerProps) {
  const [isEditorMode, setIsEditorMode] = React.useState(false);
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const [showCommitDialog, setShowCommitDialog] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(content);
  const [hasChanges, setHasChanges] = React.useState(false);
  const editorRef = React.useRef<any>(null);

  // Get language from file path or use provided language
  const detectedLanguage = language || getLanguageFromPath(path);

  // Update editor content when path changes
  React.useEffect(() => {
    setEditedContent(content);
    setHasChanges(false);
  }, [path, content]);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(editedContent);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditedContent(value);
      setHasChanges(value !== content);
    }
  };

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleCommit = async (message: string) => {
    if (onSave) {
      await onSave(editedContent, message);
      setHasChanges(false);
    }
  };

  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{path}</span>
        </div>
        <div className="flex items-center gap-1">
          {isOwner && hasChanges && (
            <button
              onClick={() => setShowCommitDialog(true)}
              className="p-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 
                       dark:hover:text-blue-300 rounded-md hover:bg-gray-100 
                       dark:hover:bg-gray-700"
              title="Commit changes"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsEditorMode(!isEditorMode)}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                     rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isEditorMode ? "View as text" : "Edit in code editor"}
          >
            {isEditorMode ? <FileCode className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopyContent}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                     rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Copy content"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                     rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      {isEditorMode ? (
        <Editor
          key={path} // Force new instance on path change
          loading={<div className="h-[500px] flex items-center justify-center bg-gray-900">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>}
          onMount={(editor) => {
            editorRef.current = editor;
            handleEditorDidMount();
          }}
          height="500px"
          defaultLanguage={detectedLanguage}
          value={editedContent}
          theme="vs-dark"
          options={{
            readOnly: readOnly && !isOwner,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            renderLineHighlight: 'all',
            quickSuggestions: false,
            folding: true,
            links: true,
            contextmenu: true
          }}
          onChange={handleEditorChange}
        />
      ) : (
        <div className="p-4 bg-white dark:bg-gray-900 overflow-x-auto">
          <pre className="text-sm">
            <code className={`language-${detectedLanguage}`}>
              {content}
            </code>
          </pre>
        </div>
      )}
      
      <CommitDialog
        isOpen={showCommitDialog}
        onClose={() => setShowCommitDialog(false)}
        onCommit={handleCommit}
        fileName={path}
      />
    </div>
  );
}
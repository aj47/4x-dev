'use client';

import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodePreviewPanelProps {
  code: string;
  title: string;
  onCodeChange?: (newCode: string) => void;
}

export default function CodePreviewPanel({ code, title, onCodeChange }: CodePreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [editedCode, setEditedCode] = useState(code);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    setEditedCode(code);
  }, [code]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditedCode(value);
      setPreviewKey(prev => prev + 1);
      onCodeChange?.(value);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-end px-4 py-2 space-x-2">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'code'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Code
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'preview' ? (
          <div key={previewKey} className="h-full">
            <iframe
              srcDoc={editedCode}
              className="w-full h-full border-0 bg-white"
              title="Preview"
            />
          </div>
        ) : (
          <div className="h-full">
            <MonacoEditor
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              value={editedCode}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

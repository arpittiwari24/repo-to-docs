'use client';

import { useState, useEffect, SetStateAction } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Loader2, BookOpen, LogOut, Copy, Check, Edit2, X, Save, ExternalLink } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  default_branch: string;
  private: boolean;
  fork: boolean;
  created_at: string;
  updated_at: string;
}

interface GeneratedDocs {
  readme: string;
  repositoryUrl: string;
  repositoryName: string;
  fileCount: number;
}

interface DocsGeneratorProps {
  session: Session;
}

export default function DocsGenerator({ session }: DocsGeneratorProps) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [docs, setDocs] = useState<GeneratedDocs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReadme, setEditedReadme] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (docs?.readme) {
      setEditedReadme(docs.readme);
    }
  }, [docs]);

  useEffect(() => {
    const fetchRepos = async () => {
      if (session?.user?.accessToken) {
        try {
          setError(null);
          setIsFetching(true);
          const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
              Authorization: `token ${session.user.accessToken}`,
              'Accept': 'application/vnd.github.v3+json'
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch repositories');
          }
          
          const data = await response.json();
          // Sort repositories by update date
          const sortedRepos = data.sort((a: Repository, b: Repository) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          setRepos(sortedRepos);
        } catch (error) {
          setError('Failed to fetch repositories. Please try again.');
          console.error('Failed to fetch repositories:', error);
        } finally {
          setIsFetching(false);
        }
      }
    };
    
    fetchRepos();
  }, [session?.user?.accessToken]);

  const generateDocs = async () => {
    if (!selectedRepo || !session?.user?.accessToken) return;

    setIsLoading(true);
    setError(null);
    setDocs(null);
    
    try {
      const response = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.user.accessToken,
          repoName: selectedRepo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate documentation');
      }

      const data = await response.json();
      setDocs(data);
    } catch (error) {
      setError('Failed to generate documentation. Please try again.');
      console.error('Error generating documentation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    const textToCopy = isEditing ? editedReadme : (docs?.readme || '');
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setError('Failed to copy text to clipboard');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (docs) {
      setDocs({
        ...docs,
        readme: editedReadme
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (docs) {
      setEditedReadme(docs.readme);
    }
  };

  const filteredRepos = repos.filter(repo => 
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold">GitHub Readme Generator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Repository Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Select a Repository
          </label>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              {/* <input
                type="text"
                placeholder="Search repositories..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              /> */}
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                onChange={(e) => setSelectedRepo(e.target.value)}
                value={selectedRepo ?? ''}
                disabled={isFetching}
              >
                <option value="">Choose a repository</option>
                {filteredRepos.map((repo) => (
                  <option key={repo.id} value={repo.full_name}>
                    {repo.full_name} {repo.private ? '(Private)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateDocs}
              disabled={!selectedRepo || isLoading}
              className="flex items-center justify-center space-x-2 bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 min-w-[180px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Generate Docs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8 text-sm">
            {error}
          </div>
        )}

        {/* Repository Loading State */}
        {isFetching && (
          <div className="flex items-center justify-center space-x-2 text-gray-400 my-8">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading repositories...</span>
          </div>
        )}

        {/* Documentation Display */}
        {docs && (
          <div className="bg-gray-800 rounded-lg p-4 md:p-8">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 space-y-4 md:space-y-0">
                <h2 className="text-xl md:text-2xl font-bold">{docs.repositoryName}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy README</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                  <a
                    href={docs.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on GitHub</span>
                  </a>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Generated documentation based on {docs.fileCount} files
              </p>
            </div>
            
            <div className={`prose prose-invert max-w-none ${isEditing ? 'prose-sm' : ''}`}>
              {isEditing ? (
                <div className="relative">
                  <TextareaAutosize
                    value={editedReadme}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEditedReadme(e.target.value)}
                    className="w-full bg-gray-900 text-white p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[500px] font-mono text-sm"
                    placeholder="Edit your README here..."
                    minRows={20}
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <ReactMarkdown>{docs.readme}</ReactMarkdown>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
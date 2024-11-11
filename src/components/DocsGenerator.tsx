'use client';

import { useState, useEffect, SetStateAction } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { 
  Loader2, 
  BookOpen, 
  LogOut, 
  Copy, 
  Check, 
  Edit2, 
  X, 
  Save, 
  ExternalLink, 
  Search,
  ChevronDown 
} from "lucide-react";
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

const loadingQuotes = [
  {
    quote: "Documentation is a love letter that you write to your future self.",
    author: "Damian Conway"
  },
  {
    quote: "Code tells you how, comments tell you why.",
    author: "Jeff Atwood"
  },
  {
    quote: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson"
  },
  {
    quote: "Documentation is the castor oil of programming. Managers think it is good for programmers and programmers hate it!",
    author: "Gerald Weinberg"
  },
  {
    quote: "The only way to go fast is to go well.",
    author: "Robert C. Martin"
  },
  {
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler"
  },
  {
    quote: "Good documentation is like chocolate: you can never have too much of it.",
    author: "Unknown"
  },
  {
    quote: "Without requirements or design, programming is the art of adding bugs to an empty text file.",
    author: "Louis Srygley"
  }
];

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
  const [currentQuote, setCurrentQuote] = useState(loadingQuotes[0]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let quoteInterval: NodeJS.Timeout;
    
    if (isLoading) {
      quoteInterval = setInterval(() => {
        setCurrentQuote(prevQuote => {
          const currentIndex = loadingQuotes.indexOf(prevQuote);
          const nextIndex = (currentIndex + 1) % loadingQuotes.length;
          return loadingQuotes[nextIndex];
        });
      }, 5000);
    }

    return () => {
      if (quoteInterval) {
        clearInterval(quoteInterval);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      setCurrentQuote(loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)]);
    }
  }, [isLoading]);

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
      setIsSearchOpen(false);
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <nav className="flex flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold max-sm:hidden">GitHub Readme Generator</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <span className="text-sm sm:text-base text-gray-300">
              Welcome, {session.user?.name}
            </span> */}
            <img src={session.user?.image ?? ""} className="size-10 rounded-full" alt={session.user?.name ?? ""} />
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Repository Selection */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {isSearchOpen && filteredRepos.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                    {filteredRepos.map((repo) => (
                      <button
                        key={repo.id}
                        className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between"
                        onClick={() => {
                          setSelectedRepo(repo.full_name);
                          setIsSearchOpen(false);
                        }}
                      >
                        <span className="flex-1 truncate">{repo.full_name}</span>
                        {repo.private && (
                          <span className="ml-2 px-2 py-1 text-xs bg-gray-600 rounded-full">
                            Private
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={generateDocs}
                disabled={!selectedRepo || isLoading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed min-w-[160px] sm:min-w-[180px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Generate Readme</span>
                  </>
                )}
              </button>
            </div>
            {selectedRepo && (
              <div className="mt-2 text-sm text-gray-400">
                Selected: {selectedRepo}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Loading State with Quotes */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-6 p-8 bg-gray-800 rounded-lg text-center">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span className="text-lg">Generating documentation...</span>
              </div>
              <blockquote className="max-w-2xl">
                <p className="text-lg italic text-gray-300">"{currentQuote.quote}"</p>
                <footer className="mt-2 text-sm text-gray-400">
                  — {currentQuote.author}
                </footer>
              </blockquote>
            </div>
          )}

          {/* Documentation Display */}
          {docs && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">{docs.repositoryName}</h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Generated from {docs.fileCount} files
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={handleEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-4 h-4 text-green-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
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
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <div className={`prose prose-invert max-w-none ${isEditing ? 'prose-sm' : ''}`}>
                  {isEditing ? (
                    <div className="relative">
                      <TextareaAutosize
                        value={editedReadme}
                        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEditedReadme(e.target.value)}
                        className="w-full bg-gray-900 text-white p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-[500px] font-mono text-sm leading-relaxed"
                        placeholder="Edit your README here..."
                        minRows={20}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs hover:bg-gray-700 transition-colors"
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
                    <div className="markdown-preview">
                      <ReactMarkdown 
                        components={{
                          // Custom components for better markdown rendering
                          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                          p: ({node, ...props}) => <p className="my-3 leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 my-3" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-3" {...props} />,
                          li: ({node, ...props}) => <li className="my-1" {...props} />,
                          // @ts-ignore
                          code: ({node, inline, ...props}) => 
                            inline ? 
                              <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props} /> :
                              <code className="block bg-gray-700 p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props} />,
                          blockquote: ({node, ...props}) => 
                            <blockquote className="border-l-4 border-gray-600 pl-4 my-4 italic" {...props} />,
                          a: ({node, ...props}) => 
                            <a className="text-blue-400 hover:text-blue-300 transition-colors" {...props} />,
                          table: ({node, ...props}) => 
                            <div className="overflow-x-auto my-4">
                              <table className="min-w-full border border-gray-700" {...props} />
                            </div>,
                          th: ({node, ...props}) => 
                            <th className="border border-gray-700 px-4 py-2 bg-gray-700" {...props} />,
                          td: ({node, ...props}) => 
                            <td className="border border-gray-700 px-4 py-2" {...props} />,
                        }}
                      >
                        {docs.readme}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
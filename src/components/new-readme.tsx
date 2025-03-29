'use client';

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  BookOpen, 
  Search,
  AlertCircle,
  Github
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

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

interface NewReadmeProps {
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

export default function NewReadme({ session }: NewReadmeProps) {
  const router = useRouter();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      router.push(`/readme/${data.id}`);
    } catch (error) {
      setError('Failed to generate documentation. Please try again.');
      console.error('Error generating documentation:', error);
      setIsLoading(false);
    }
  };

  const filteredRepos = repos.filter(repo => 
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New README</h1>
        <p className="text-gray-400 mt-1">Generate a comprehensive README for your GitHub repository</p>
      </div>

      <Card className="bg-gray-200 border-gray-700 text-black">
        <CardHeader>
          <CardTitle>Select Repository</CardTitle>
          <CardDescription>
            Choose the GitHub repository you want to generate a README for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search repositories..."
                className="bg-gray-900 border-gray-700 focus-visible:ring-blue-600 text-gray-100"
                value={searchTerm}
                // @ts-ignore
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-100" />
            </div>
            
            {isSearchOpen && filteredRepos.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-gray-200 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                {filteredRepos.map((repo) => (
                  <button
                    key={repo.id}
                    className="w-full px-4 py-3 text-left hover:bg-cyan-700 transition-colors flex items-center justify-between"
                    onClick={() => {
                      setSelectedRepo(repo.full_name);
                      setIsSearchOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <Github className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="flex-1 truncate">{repo.full_name}</span>
                    </div>
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

          {selectedRepo && (
            <div className="mt-4 p-4 bg-gray-300 rounded-lg border border-gray-700">
              <div className="flex items-center">
                <Github className="w-5 h-5 text-gray-300 mr-2" />
                <span className="font-medium">{selectedRepo}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="border-gray-700 hover:bg-gray-700 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={generateDocs}
            disabled={!selectedRepo || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                <span>Generate README</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Card className="bg-gray-200 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="text-lg">Generating documentation...</span>
            </div>
            <blockquote className="max-w-2xl">
              <p className="text-lg italic text-gray-800">"{currentQuote.quote}"</p>
              <footer className="mt-2 text-sm text-gray-800">
                — {currentQuote.author}
              </footer>
            </blockquote>
            <p className="mt-6 text-sm text-gray-400">
              This may take a minute as we analyze your repository files and generate a comprehensive README.
            </p>
          </CardContent>
        </Card>
      )}

      {isFetching && !isLoading && !error && (
        <Card className="bg-gray-200 border-gray-700">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400 mr-3" />
            <span>Loading your repositories...</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  PlusCircle, 
  ExternalLink, 
  Loader2, 
  Copy, 
  Check,
  Edit2,
  Clock
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

interface ReadmeHistory {
  id: string;
  repo_name: string;
  repo_url: string;
  markdown: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardProps {
  session: Session;
}

export default function Dashboard({ session }: DashboardProps) {
  const router = useRouter();
  const [recentReadmes, setRecentReadmes] = useState<ReadmeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentReadmes();
  }, []);

  const fetchRecentReadmes = async () => {
    if (!session?.user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/generate-docs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent READMEs');
      }
      
      const data = await response.json();
      setRecentReadmes(data);
    } catch (error) {
      console.error('Error fetching recent READMEs:', error);
      setError('Failed to load your recent READMEs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (readmeId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(readmeId);
      setTimeout(() => setIsCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to your README generator</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/new-readme')}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New README
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
          <Link href="/new-readme" className="block h-full">
            <CardHeader className="flex items-center justify-center h-40 border-b border-gray-700">
              <PlusCircle className="w-16 h-16 text-blue-400 opacity-70" />
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-center">Create New README</h3>
              <p className="text-gray-400 text-center mt-2">
                Generate a new README based on your repository
              </p>
            </CardContent>
          </Link>
        </Card>

        {isLoading ? (
          <Card className="bg-gray-800 border-gray-700 col-span-1">
            <CardContent className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </CardContent>
          </Card>
        ) : recentReadmes.length > 0 ? (
          recentReadmes.slice(0, 5).map((readme) => (
            <Card key={readme.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="truncate">{readme.repo_name}</CardTitle>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(readme.createdAt)}
                  </div>
                </div>
                <CardDescription className="flex items-center mt-1">
                  <Link 
                    href={readme.repo_url} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    View Repository
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-24 overflow-hidden text-sm text-gray-300 mb-2">
                  <div className="line-clamp-4">
                    {readme.markdown.slice(0, 300)}...
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-600"
                  onClick={() => handleCopy(readme.id, readme.markdown)}
                >
                  {isCopied === readme.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy
                    </>
                  )}
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-gray-600"
                    onClick={() => router.push(`/readme/${readme.id}/edit`)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push(`/readme/${readme.id}`)}
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="bg-gray-800 border-gray-700 col-span-1 md:col-span-2">
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="w-12 h-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No READMEs Found</h3>
              <p className="text-gray-400 max-w-md">
                You haven't created any READMEs yet. Click the "Create New README" button to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
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
  history: ReadmeHistory[] | ReadmeHistory;
}

export default function Dashboard({ session , history }: DashboardProps) {
  const router = useRouter();
  const [recentReadmes, setRecentReadmes] = useState<ReadmeHistory[]>(() => {
    // Check if history is an array
    if (Array.isArray(history)) {
      return history;
    } 
    // Check if history is a single object and not null/undefined
    else if (history && typeof history === 'object') {
      return [history];
    }
    // Default to empty array if history is null or undefined
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<string | null>(null);

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
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to your README generator</p>
        </div>
       <Link href={"/new-readme"} prefetch={true}>
       <Button
          className="bg-pink-600 hover:bg-pink-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New README
        </Button>
       </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <Card className="bg-gray-100 border-gray-700 hover:bg-gray-200 transition-colors">
          <Link href="/new-readme" prefetch={true} className="block h-full">
            <CardHeader className="flex items-center justify-center h-40 border-b border-gray-700">
              <PlusCircle className="w-16 h-16 text-pink-400 opacity-70" />
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold text-center">Create New README</h3>
              <p className="text-gray-400 text-center mt-2">
                Generate a new README based on your repository
              </p>
            </CardContent>
          </Link>
        </Card> */}

        {isLoading ? (
          <Card className="bg-transparent border-gray-200 col-span-1">
            <CardContent className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
            </CardContent>
          </Card>
        ) : recentReadmes.length > 0 ? (
          recentReadmes.slice(0, 5).map((readme) => (
            <Card 
            key={readme.id} 
            className="bg-white/5 backdrop-blur-md border border-gray-700/40 shadow-lg hover:bg-white/10 transition-colors duration-300"
          >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="truncate text-white">{readme.repo_name}</CardTitle>
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
                    className="text-pink-500 hover:text-pink-400 flex items-center"
                  >
                    View Repository
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-24 overflow-hidden text-sm text-gray-600 mb-2">
                  <div className="line-clamp-4">
                              <div className="prose prose-invert max-w-none">
                                <ReactMarkdown
                                  components={{
                                    // Custom components for better markdown rendering
                                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-8 mb-4 text-gray-300" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-6 mb-3 text-gray-400" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-md font-bold mt-4 mb-2 text-gray-500" {...props} />,
                                    p: ({node, ...props}) => <p className="my-3 leading-relaxed text-gray-500" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc pl-6 my-3" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-3" {...props} />,
                                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                                    // @ts-ignore
                                    code: ({node, inline, className, children, ...props}) => {
                                      const match = /language-(\w+)/.exec(className || '');
                                      return !inline && match ? (
                                        <pre className="bg-gray-700 p-4 rounded-lg overflow-x-auto my-4">
                                          <code className={className} {...props}>
                                            {children}
                                          </code>
                                        </pre>
                                      ) : (
                                        <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                                          {children}
                                        </code>
                                      );
                                    },
                                    pre: ({node, ...props}) => <pre className="bg-gray-700 p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props} />,
                                    blockquote: ({node, ...props}) => 
                                      <blockquote className="border-l-4 border-gray-600 pl-4 my-4 italic" {...props} />,
                                    a: ({node, ...props}) => 
                                      <a className="text-pink-400 hover:text-pink-300 transition-colors" {...props} />,
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
                                  {readme.markdown.slice(0,250)}
                                </ReactMarkdown>
                              </div>
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
                    className="bg-pink-600 hover:bg-pink-700"
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
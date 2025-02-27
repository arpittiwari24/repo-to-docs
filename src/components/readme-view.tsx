'use client';

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { 
  Loader2, 
  Copy, 
  Check, 
  Edit2, 
  ExternalLink, 
  Github,
  AlertCircle,
  ArrowLeft,
  Trash2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ReadmeViewProps {
  session: Session;
  readmeId: string;
}

export default function ReadmeView({ session, readmeId }: ReadmeViewProps) {
  const router = useRouter();
  const [readme, setReadme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchReadme();
  }, [readmeId]);

  const fetchReadme = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/saved/${readmeId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('README not found');
        }
        throw new Error('Failed to fetch README');
      }
      
      const data = await response.json();
      setReadme(data);
    } catch (error: any) {
      console.error('Error fetching README:', error);
      setError(error.message || 'Failed to load README');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readme?.markdown || '');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setError('Failed to copy text to clipboard');
    }
  };

  const commitToRepo = async () => {
    if (!readme?.repo_name || !session?.user?.accessToken) return;
    
    setIsCommitting(true);
    setError(null);
    setCommitSuccess(null);
    
    try {
      const response = await fetch('/api/commit-readme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.user.accessToken,
          repoName: readme.repo_name,
          readmeContent: readme.markdown,
          readmeId: readme.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to commit README');
      }

      const data = await response.json();
      setCommitSuccess(data.commitUrl);
    } catch (error: any) {
      setError(`Failed to commit README: ${error.message}`);
      console.error('Error committing README:', error);
    } finally {
      setIsCommitting(false);
    }
  };

  const deleteReadme = async () => {
    if (!readmeId) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/saved/${readmeId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete README');
      }
      
      router.push('/');
    } catch (error) {
      console.error('Error deleting README:', error);
      setError('Failed to delete README');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-white">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!readme) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">README not found</h2>
        <p className="text-gray-400 mb-6">The requested README could not be found</p>
        <Button 
          onClick={() => router.push('/')}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold">{readme.repo_name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-gray-700 hover:bg-gray-700"
            onClick={() => router.push(`/readme/${readmeId}/edit`)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="bg-red-700 hover:bg-red-800">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription className="text-gray-400">
                  This will permanently delete this README from your account.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-700"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="bg-red-700 hover:bg-red-800"
                  onClick={deleteReadme}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete README'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {commitSuccess && (
        <Alert className="bg-green-900/50 border-green-700 text-white">
          <Check className="h-4 w-4 text-green-400" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            <div>README successfully committed to GitHub!</div>
            <a 
              href={commitSuccess}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-pink-400 hover:text-pink-300 text-sm mt-1"
            >
              <span>View commit</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{readme.repo_name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <a 
                  href={readme.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 flex items-center"
                >
                  <Github className="w-4 h-4 mr-1" />
                  View Repository
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-gray-700"
                onClick={handleCopy}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                className="bg-green-700 hover:bg-green-800"
                onClick={commitToRepo}
                disabled={isCommitting}
              >
                {isCommitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Committing...
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4 mr-2" />
                    Commit to Repo
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 bg-white text-black">
          <div className="prose prose-invert max-w-none ">
            <ReactMarkdown 
              components={{
                // Custom components for better markdown rendering
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-black" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-700" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-700" {...props} />,
                p: ({node, ...props}) => <p className="my-3 leading-relaxed text-gray-700" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 my-3" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-3" {...props} />,
                li: ({node, ...props}) => <li className="my-1" {...props} />,
                // @ts-ignore
                code: ({node, inline, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto my-4">
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
              {readme.markdown}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
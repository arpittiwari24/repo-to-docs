'use client';

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import { 
  Loader2, 
  Save, 
  Copy, 
  Check, 
  ArrowLeft, 
  AlertCircle,
  Eye,
  Code,
  Github
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ReadmeEditProps {
  session: Session;
  readmeId: string;
}

export default function ReadmeEdit({ session, readmeId }: ReadmeEditProps) {
  const router = useRouter();
  const [readme, setReadme] = useState<any>(null);
  const [editedReadme, setEditedReadme] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  useEffect(() => {
    fetchReadme();
  }, [readmeId]);

  useEffect(() => {
    if (readme?.markdown) {
      setEditedReadme(readme.markdown);
    }
  }, [readme]);

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
      await navigator.clipboard.writeText(editedReadme);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setError('Failed to copy text to clipboard');
    }
  };

  const saveReadme = async () => {
    if (!readmeId || !editedReadme) return;
    
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      const response = await fetch(`/api/saved/${readmeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdown: editedReadme
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save README');
      }

      setSaveSuccess(true);
      // Update the readme state with the edited content
      setReadme({
        ...readme,
        markdown: editedReadme
      });
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setError(`Failed to save README: ${error.message}`);
      console.error('Error saving README:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const commitToRepo = async () => {
    if (!readme?.repo_name || !session?.user?.accessToken) return;
    
    setIsCommitting(true);
    setError(null);
    setCommitSuccess(null);
    
    try {
      // First save the edited content
      await saveReadme();
      
      const response = await fetch('/api/commit-readme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: session.user.accessToken,
          repoName: readme.repo_name,
          readmeContent: editedReadme,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error && !readme) {
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
          className="bg-blue-600 hover:bg-blue-700"
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
            onClick={() => router.push(`/readme/${readmeId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold max-sm:hidden">Editing: {readme.repo_name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-gray-700 hover:bg-gray-700 text-black"
            onClick={handleCopy}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-400" />
                <span className="max-sm:hidden text-white">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2 text-white" />
                <span className="max-sm:hidden text-white">Copy</span>
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
                <span className="max-sm:hidden">Committing ...</span>
              </>
            ) : (
              <>
                <Github className="w-4 h-4 mr-2" />
                <span className="max-sm:hidden">Commit to Repo</span>
              </>
            )}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={saveReadme}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="max-sm:hidden">Saving ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                <span className="max-sm:hidden">Save</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert className="bg-green-900/50 border-green-700 text-white">
          <Check className="h-4 w-4 text-green-400" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            README saved successfully
          </AlertDescription>
        </Alert>
      )}

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
              className="flex items-center text-blue-400 hover:text-blue-300 text-sm mt-1"
            >
              <span>View commit</span>
              <Check className="w-3 h-3 ml-1" />
            </a>
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-200 max-sm:hidden">{readme.repo_name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <a 
                  href={readme.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <Github className="w-4 h-4 mr-1" />
                  View Repository
                </a>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-gray-900 p-0 flex justify-start rounded-none border-b border-gray-700 text-white">
            <TabsTrigger 
              value="edit" 
              className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600"
            >
              <Code className="w-4 h-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-0 p-0">
            <div className="relative">
              <TextareaAutosize
                value={editedReadme}
                onChange={(e) => setEditedReadme(e.target.value)}
                className="w-full bg-gray-900 text-white p-6 outline-none min-h-[500px] font-mono text-sm leading-relaxed border-0"
                placeholder="Edit your README here..."
                minRows={30}
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-0 p-0">
            <div className="p-6 prose prose-invert max-w-none min-h-[500px] bg-gray-900 max-sm:break-words">
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
                {editedReadme}
              </ReactMarkdown>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
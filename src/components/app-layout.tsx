'use client';

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Loader2, 
  LogOut, 
  Pen,
  FileText,
  Home,
  PlusCircle,
  ChevronRight,
  MenuIcon,
  X
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReadmeHistory {
  id: string;
  repo_name: string;
  repo_url: string;
  markdown: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface LayoutProps {
  session: Session;
  children: React.ReactNode;
  history: ReadmeHistory[] | ReadmeHistory; // Updated to accept either array or single object
}

export default function AppLayout({ session, children, history }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoadingReadmes, setIsLoadingReadmes] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Initialize recentReadmes based on history prop type
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

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Debug log to check what we're actually working with
  useEffect(() => {
    console.log("History prop:", history);
    console.log("Recent READMEs state:", recentReadmes);
  }, [history]);

  return (
    <div className="flex min-h-screen text-white">
      {/* Desktop Sidebar - FIXED HEIGHT */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0 border-r border-gray-800 ">
        <div className="flex flex-col h-screen sticky top-0 bg-black text-white bg-opacity-50 backdrop-blur-sm">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center py-4 border-b border-gray-800">
            <Pen className="w-8 h-8 text-white" />
            <h1 className="ml-2 text-2xl font-bold">PenAI</h1>
          </div>
          
          {/* Navigation Section */}
          <div className="flex flex-col flex-grow overflow-hidden">
            <nav className="px-2 pt-4">
              <Link 
                href="/" 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive('/') ? 'bg-pink-600 bg-opacity-50 text-pink-300' : 'hover:bg-gray-600'
                }`}
                prefetch={true}
              >
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                href="/new-readme" 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive('/new-readme') ? 'bg-pink-600 bg-opacity-50 text-pink-300' : 'hover:bg-gray-600'
                }`}
                prefetch={true}
              >
                <PlusCircle className="w-5 h-5 mr-3" />
                <span>New README</span>
              </Link>
            </nav>
            
            {/* Recent READMEs Section */}
            <div className="px-4 pt-6 pb-2 mt-2 border-t border-gray-800">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Recent READMEs
              </h2>
            </div>
            
            {/* Scrollable List */}
            <div className="flex-grow overflow-y-auto">
              <div className="px-2 space-y-1">
                {isLoadingReadmes ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : recentReadmes.length > 0 ? (
                  recentReadmes.map((readme) => (
                    <Link
                      key={readme.id}
                      href={`/readme/${readme.id}`}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                        isActive(`/readme/${readme.id}`) ? 'bg-pink-600 bg-opacity-50 text-pink-300' : 'hover:bg-gray-600'
                      }`}
                      onClick={() => setOpen(false)}
                      prefetch={true}
                    >
                      <div className="flex items-center overflow-hidden">
                        <FileText className="w-4 h-4 min-w-4 mr-2" />
                        <span className="truncate">{readme.repo_name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isActive(`/readme/${readme.id}`) ? 'rotate-90' : ''
                      }`} />
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400">
                    No READMEs found
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* User Profile Footer - FIXED AT BOTTOM */}
          <div className="flex items-center p-4 border-t border-gray-800 mt-auto">
            <img 
              src={session.user?.image ?? ""} 
              className="w-8 h-8 rounded-full" 
              alt={session.user?.name ?? ""} 
            />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => signOut()} 
                    className="ml-auto p-1.5 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Log out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-800">
            <MenuIcon className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-black bg-opacity-95 border-r border-gray-800">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <div className="flex items-center">
                <Pen className="w-6 h-6 text-white" />
                <h1 className="ml-2 text-xl font-bold">PenAI</h1>
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mobile Navigation with Fixed Structure */}
            <div className="flex flex-col h-[calc(100%-8rem)]">
              <nav className="px-2 pt-4">
                <Link 
                  href="/" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive('/') ? 'bg-pink-600 bg-opacity-50 text-pink-300' : 'hover:bg-gray-600'
                  }`}
                  onClick={() => setOpen(false)}
                  prefetch={true}
                >
                  <Home className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  href="/new-readme" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive('/new-readme') ? 'bg-pink-600 bg-opacity-50 text-pink-300' : 'hover:bg-gray-600'
                  }`}
                  onClick={() => setOpen(false)}
                  prefetch={true}
                >
                  <PlusCircle className="w-5 h-5 mr-3" />
                  <span>New README</span>
                </Link>
              </nav>
              
              <div className="px-4 pt-4 pb-2 mt-2 border-t border-gray-800">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Recent READMEs
                </h2>
              </div>
              
              {/* Scrollable area */}
              <div className="flex-grow overflow-y-auto px-2">
                <div className="space-y-1">
                  {isLoadingReadmes ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : recentReadmes.length > 0 ? (
                    recentReadmes.map((readme) => (
                      <Link
                        key={readme.id}
                        href={`/readme/${readme.id}`}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                          isActive(`/readme/${readme.id}`) ? 'bg-pink-600 bg-opacity-50 text-pink-300' : 'hover:bg-gray-600'
                        }`}
                        onClick={() => setOpen(false)}
                        prefetch={true}
                      >
                        <div className="flex items-center overflow-hidden">
                          <FileText className="w-4 h-4 min-w-4 mr-2" />
                          <span className="truncate">{readme.repo_name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      No READMEs found
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Fixed footer */}
            <div className="flex items-center p-4 border-t border-gray-800 mt-auto">
              <img 
                src={session.user?.image ?? ""} 
                className="w-8 h-8 rounded-full" 
                alt={session.user?.name ?? ""} 
              />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{session.user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
              </div>
              <button 
                onClick={() => signOut()} 
                className="ml-auto p-1.5 rounded-md hover:bg-gray-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-end h-16 px-4 border-b border-gray-800">
          <div className="flex-1 ml-12 text-center">
            <h1 className="text-xl font-bold">PenAI</h1>
          </div>
          <img 
            src={session.user?.image ?? ""} 
            className="w-8 h-8 rounded-full" 
            alt={session.user?.name ?? ""} 
          />
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
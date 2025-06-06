"use client";

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
  Crown,
} from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  session: Session & { user?: { premium?: boolean, id?: string } };
  children: React.ReactNode;
  history: ReadmeHistory[];
}

export default function AppLayout({ session, children, history }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Normalize history to always be an array
  const recentReadmes = Array.isArray(history) ? history : [];
  const isPremium = session?.user?.premium || false;

  const isActive = (path: string) => pathname === path;

  const PremiumModal = () => (
    <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Crown className="w-5 h-5 mr-2 text-yellow-400" />
            Upgrade to Readme Generator Pro
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Unlock premium features to supercharge your README creation
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Pro Plan - $15 (one time)</h3>
            <ul className="space-y-2">
              {[
                "Unlimited README generations",
                "Direct Commit to Github",
                "Priority support",
                "No limits"
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="bg-cyan-900 p-1 rounded-full mr-2">
                    <svg className="w-3 h-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <a
            href={`https://readme-gen.lemonsqueezy.com/buy/1cdbff2d-b771-40db-b207-18f36747c01c?checkout[custom][user_id]=${session.user.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              Upgrade to Pro
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const NavigationItems = ({ mobile = false }) => (
    <nav className="px-2 pt-4">
      <Link
        href="/"
        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
          isActive("/")
            ? "bg-cyan-600 bg-opacity-50 text-cyan-300"
            : "hover:bg-cyan-300 hover:bg-opacity-50"
        }`}
        onClick={() => mobile && setOpen(false)}
        prefetch={true}
      >
        <Home className="w-5 h-5 mr-3" />
        <span>Dashboard</span>
      </Link>

      {/* Show "New README" only if user is premium OR has no readmes yet */}
      {(isPremium || recentReadmes.length === 0) && (
        <Link
          href="/new-readme"
          className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
            isActive("/new-readme")
              ? "bg-cyan-600 bg-opacity-50 text-cyan-300"
              : "hover:bg-gray-600"
          }`}
          onClick={() => mobile && setOpen(false)}
          prefetch={true}
        >
          <PlusCircle className="w-5 h-5 mr-3" />
          <span>New README</span>
        </Link>
      )}

      {!isPremium && (
        <button
          onClick={() => {
            setIsPremiumModalOpen(true);
            mobile && setOpen(false);
          }}
          className="flex items-center w-full px-4 py-3 mt-2 rounded-lg text-sm bg-gradient-to-r from-yellow-500 to-amber-600 bg-opacity-20 hover:bg-opacity-30 transition-colors"
        >
          <Crown className="w-5 h-5 mr-3 text-white" />
          <span>Upgrade to Pro</span>
        </button>
      )}
    </nav>
  );

  const RecentReadmesList = ({ mobile = false }) => (
    <>
      <div className="px-4 pt-6 pb-2 mt-2 border-t border-gray-800">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Recent READMEs{" "}
          {!isPremium && (
            <span className="text-xs text-gray-600">
              {recentReadmes.length}/1 used
            </span>
          )}
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto px-2">
        <div className="space-y-1">
          {recentReadmes.length > 0 ? (
            recentReadmes.map((readme) => (
              <Link
                key={readme.id}
                href={`/readme/${readme.id}`}
                className={`flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  isActive(`/readme/${readme.id}`)
                    ? "bg-cyan-600 bg-opacity-50 text-cyan-300"
                    : "hover:bg-cyan-300 hover:bg-opacity-50"
                }`}
                onClick={() => mobile && setOpen(false)}
                prefetch={true}
              >
                <div className="flex items-center overflow-hidden">
                  <FileText className="w-4 h-4 min-w-4 mr-2" />
                  <span className="truncate">{readme.repo_name}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive(`/readme/${readme.id}`) ? "rotate-90" : ""
                  }`}
                />
              </Link>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              No READMEs found
            </div>
          )}
        </div>
      </div>
    </>
  );

  const UserProfile = ({ mobile = false }) => (
    <div className="flex items-center p-4 border-t border-gray-800 mt-auto">
      <img
        src={session.user?.image ?? ""}
        className="w-8 h-8 rounded-full"
        alt={session.user?.name ?? ""}
      />
      <div className="ml-3 overflow-hidden">
        <div className="flex items-center">
          <p className="text-sm font-medium truncate">
            {session.user?.name}
          </p>
          {isPremium && (
            <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-amber-600 text-xs">
              PRO
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-400 truncate">
          {session.user?.email}
        </p>
      </div>
      <div className="ml-auto flex items-center">
        {!isPremium && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setIsPremiumModalOpen(true);
                    mobile && setOpen(false);
                  }}
                  className="p-1.5 rounded-md hover:bg-yellow-300 hover:bg-opacity-20 transition-colors mr-1"
                >
                  <Crown className="w-4 h-4 text-yellow-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Upgrade to Pro</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-md hover:bg-gray-300 hover:bg-opacity-20 transition-colors"
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
  );

  return (
    <div className="flex min-h-screen text-white">
      <PremiumModal />

      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0 border-r border-gray-800">
        <div className="flex flex-col h-screen sticky top-0 bg-black text-white bg-opacity-50 backdrop-blur-sm">
          <div className="flex items-center justify-center py-1 border-b border-gray-800">
            <img src="/logos.webp" alt="" className="size-14"/>
            {/* <h1 className="ml-2 text-2xl font-bold">Readme Generator</h1> */}
          </div>

          <div className="flex flex-col flex-grow overflow-hidden">
            <NavigationItems />
            <RecentReadmesList />
          </div>

          <UserProfile />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-gray-800">
            <MenuIcon className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-black bg-opacity-95 border-r border-gray-800 text-white"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <div className="flex items-center">
                <img src="/logos.webp" alt="" className="size-14 rounded-full" />
              </div>
            </div>

            <div className="flex flex-col h-[calc(100%-8rem)]">
              <NavigationItems mobile />
              <RecentReadmesList mobile />
            </div>

            <UserProfile mobile />
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
          <div className="flex items-center">
            {!isPremium && (
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="p-1.5 rounded-md hover:bg-yellow-300 hover:bg-opacity-20 transition-colors mr-2"
              >
                <Crown className="w-4 h-4 text-yellow-400" />
              </button>
            )}
            <img
              src={session.user?.image ?? ""}
              className="w-8 h-8 rounded-full"
              alt={session.user?.name ?? ""}
            />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
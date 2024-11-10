'use client';

import { signIn } from "next-auth/react";
import { GitBranch } from "lucide-react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("github")}
      className="flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
    >
      <GitBranch className="w-5 h-5" />
      <span>Sign in with GitHub</span>
    </button>
  );
}
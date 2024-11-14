'use client';

import { signIn } from "next-auth/react";
import { GitBranch } from "lucide-react";

export default function LoginButton() {
  return (
<button
  onClick={() => signIn("github")}
  className="flex items-center space-x-2 text-white px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:from-purple-600 hover:to-blue-500"
>
  <GitBranch className="w-5 h-5 text-white" />
  <span className="font-semibold">Sign in with GitHub</span>
</button>

  );
}
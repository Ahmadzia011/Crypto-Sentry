"use client";

import { SessionProvider } from "next-auth/react";

// This wrapper gives the whole app access to NextAuth's session state.
// Without it, components such as signIn(), signOut(), and useSession() would not be able to read or update auth state.
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
} 
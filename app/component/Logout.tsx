"use client"

import { signOut } from "next-auth/react";

export function LogOut() {
    

    async function handleSignout() {
        console.log("working")
        signOut({ callbackUrl: '/login' }); // Redirects to your login page
    }
    
    
    return (
<a onClick={handleSignout} className="flex items-center px-4 py-3 text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl  group border border-transparent hover:border-rose-500/20">
  <span  className="cursor-pointer mr-3 text-xl font-bold group-hover:scale-110 transition-transform duration-200">
    ⏻
  </span>
  <span className="hover:cursor-pointer text-sm font-bold tracking-tight uppercase">
    Terminate Session
  </span>
</a>
);
}

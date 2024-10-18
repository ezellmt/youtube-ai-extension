import React from "react";

import { cn } from "@/lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({ className, children, ...props }: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex h-12 items-center justify-center rounded-full px-6 font-medium text-black transition-all",
        "bg-white hover:bg-gray-100 active:bg-gray-200",
        "before:absolute before:inset-0 before:rounded-full before:p-[2px]",
        "before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500",
        "before:content-[''] before:-z-10",
        "after:absolute after:inset-0 after:rounded-full after:bg-white",
        "after:content-[''] after:-z-10",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

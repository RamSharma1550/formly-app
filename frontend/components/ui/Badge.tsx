import React from "react";
import { cn } from "@/lib/utils";
import { FormStatus } from "@/types/form";

interface BadgeProps {
  status: FormStatus | string;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  const isPublished = status === "published";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase",
        isPublished
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-amber-50 text-amber-700 border border-amber-200",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
        )}
      />
      {status}
    </span>
  );
}

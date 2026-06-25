"use client";

import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800/20">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-850 dark:hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

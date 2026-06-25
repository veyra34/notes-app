import { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  sublabel: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">{label}</p>
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-750 flex items-center justify-center border border-gray-200 dark:border-slate-650 shadow-inner">
          <Icon className="w-5 h-5 text-gray-800 dark:text-slate-250" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">{value}</p>
        <p className="text-xs text-gray-405 dark:text-slate-500 mt-1.5 font-medium">{sublabel}</p>
      </div>
    </div>
  );
}
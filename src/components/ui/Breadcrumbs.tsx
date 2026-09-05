import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onHomeClick: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onHomeClick }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs sm:text-sm text-slate-600 overflow-x-auto whitespace-nowrap">
        <button
          onClick={onHomeClick}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <Home className="w-3.5 h-3.5 text-amber-700" />
          <span>Home</span>
        </button>

        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {item.active ? (
              <span className="font-semibold text-slate-900" aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="hover:text-slate-900 transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

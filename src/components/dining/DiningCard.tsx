import React from 'react';
import { Utensils } from 'lucide-react';

interface MenuItem {
  name: string;
  description: string;
  note?: string;
}

interface DiningCardProps {
  title: string;
  items: MenuItem[];
}

export const DiningCard: React.FC<DiningCardProps> = ({ title, items }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200/80 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold font-serif-luxury text-slate-900">
            {title}
          </h3>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="group">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
                  {item.name}
                </h4>
                {item.note && (
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 whitespace-nowrap">
                    {item.note}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

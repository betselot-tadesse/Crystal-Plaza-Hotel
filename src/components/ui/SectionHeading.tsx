import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  centered = true,
  light = false,
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}`}>
      {badge && (
        <div className="mb-3">
          <span className={`inline-block text-xs font-semibold tracking-[0.3em] uppercase py-1 px-3 rounded-sm border ${
            light 
              ? 'text-[#C5A059] border-[#C5A059]/30 bg-[#C5A059]/10' 
              : 'text-[#C5A059] border-[#C5A059]/30 bg-[#0A192F]/5'
          }`}>
            {badge}
          </span>
        </div>
      )}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-4 leading-tight ${
        light ? 'text-white' : 'text-[#0A192F]'
      }`}>
        {title}
      </h2>
      <div className={`h-0.5 w-16 bg-[#C5A059] mb-4 ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className={`text-sm sm:text-base leading-relaxed ${
          light ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

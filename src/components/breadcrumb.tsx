'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6 overflow-x-auto pb-2">
      <Link 
        href="/" 
        className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap group"
      >
        <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap">
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            {item.href && !isLast ? (
              <Link 
                href={item.href}
                className="text-gray-500 hover:text-blue-600 transition-colors hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`${isLast ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

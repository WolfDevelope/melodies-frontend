import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ContentSection - Reusable section component for home page
 * Displays a title with optional "Show all" link and horizontal scrollable content
 */
const ContentSection = ({ title, showAllLink, children }) => {
  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">
          {title}
        </h2>
        {showAllLink && (
          <Link 
            to={showAllLink} 
            className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
          >
            Hiển thị tất cả
          </Link>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {children}
      </div>
    </div>
  );
};

export default ContentSection;
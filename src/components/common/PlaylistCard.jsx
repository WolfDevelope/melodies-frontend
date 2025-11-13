import React from 'react';

/**
 * PlaylistCard - Card component for playlists and charts
 * Features gradient background with title overlay
 */
const PlaylistCard = ({ title, description, gradient, icon, onClick }) => {
  return (
    <div
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      <div 
        className="relative aspect-square rounded-lg overflow-hidden shadow-lg"
        style={{
          background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {/* Icon/Logo */}
        {icon && (
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white font-bold text-2xl mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-white/80 text-sm">
              {description}
            </p>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
      </div>
    </div>
  );
};

export default PlaylistCard;
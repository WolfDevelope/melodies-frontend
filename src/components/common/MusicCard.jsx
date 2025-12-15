import React, { useState } from 'react';
import PlayButton from './PlayButton';

/**
 * MusicCard - Reusable card component for music content
 * @param {string} image - Image URL
 * @param {string} title - Card title
 * @param {string} description - Card description
 * @param {function} onClick - Click handler
 * @param {function} onPlay - Play button click handler
 * @param {string} type - Card type: 'square' or 'circle' (for artists)
 */
const MusicCard = ({ image, title, description, onClick, onPlay, type = 'square' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Card Container */}
      <div className=" hover:bg-[#22172b] rounded-lg p-4 transition-all duration-300">
        {/* Image Container */}
        <div className="relative mb-4">
          <img
            src={image}
            alt={title}
            className={`w-full aspect-square object-cover ${
              type === 'circle' ? 'rounded-full' : 'rounded-md'
            } shadow-lg`}
          />
          
          {/* Play Button Overlay */}
          {isHovered && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <PlayButton
                size={48}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.(e);
                }}
              />
            </div>
          )}
        </div>

        {/* Card Content */}
        <div>
          <h3 className="text-white font-semibold mb-2 truncate">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
import { useEffect } from 'react';

/**
 * Custom hook to update page title dynamically
 * @param {string} title - The page title (e.g., "Trang chủ", "Tìm kiếm")
 * @param {string} prefix - Optional prefix (default: "Melodies")
 */
const usePageTitle = (title, prefix = 'Melodies') => {
  useEffect(() => {
    const previousTitle = document.title;
    
    if (title) {
      document.title = `${prefix} - ${title}`;
    } else {
      document.title = prefix;
    }

    // Cleanup: restore previous title on unmount
    return () => {
      document.title = previousTitle;
    };
  }, [title, prefix]);
};

export default usePageTitle;

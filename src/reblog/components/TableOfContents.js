"use client";

import { useState, useEffect } from 'react';

export default function TableOfContents({ content }) {
  const [toc, setToc] = useState([]);

  useEffect(() => {
    // Extract headings using regex
    const headingRegex = /^(#{2,4})\s+(.+)$/gm;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length; // Number of # symbols
      const text = match[2];
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      headings.push({ level, text, id });
    }
    
    setToc(headings);
  }, [content]);

  // Handle click on TOC item
  const handleTocClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg mb-6 md:mb-8 border border-gray-100 overflow-y-auto sticky top-4 dark:bg-gray-900 dark:border-gray-800 max-h-[40vh] md:max-h-[60vh] lg:max-h-[80vh]">
      <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-gray-800 pb-2 border-b border-gray-100 dark:border-gray-700 dark:text-white">Contents</h2>
      {toc.length > 0 ? (
        <ul className="space-y-1">
          {toc.map((heading, index) => (
            <li 
              key={index} 
              style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
            >
              <a 
                href={`#${heading.id}`} 
                onClick={(e) => handleTocClick(e, heading.id)}
                className="block py-1 md:py-1.5 px-2 md:px-3 rounded-md transition-all duration-200 text-xs md:text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:dark:bg-black"
              >
                <div className="flex items-center dark:text-white">
                  <div className="w-1 h-1 rounded-full mr-2 bg-gray-300"></div>
                  {heading.text}
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No headings found</p>
      )}
    </div>
  );
} 
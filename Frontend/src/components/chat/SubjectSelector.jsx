/**
 * Subject Selector Component
 * Module 3: Main Chat Interface
 * 
 * Dropdown menu for subject selection, grade readonly
 * As specified in README.md Module 3
 * 
 * Layout: [Math ▼] Grade 8
 * Design: Dropdown menu for subject selection, grade readonly, changes context when switched
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';

const SubjectSelector = ({ selectedGrade, selectedSubject, onSubjectChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Subjects as per README spec
  const subjects = ['Math', 'Science', 'Social Science', 'English', 'Hindi', 'Sanskrit'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubjectSelect = (subject) => {
    onSubjectChange(subject);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Subject Dropdown Button - Mobile optimized */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 sm:px-4 py-2.5 sm:py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors touch-manipulation active:scale-98"
      >
        <div className="flex items-center space-x-2 min-w-0">
          <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-300 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {selectedSubject}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-gray-600 pl-2 hidden sm:inline">
            {selectedGrade}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mobile Grade Display - Shown only on mobile */}
      <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1">
        {selectedGrade}
      </div>

      {/* Dropdown Menu - Mobile optimized */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 sm:right-0 sm:left-auto sm:w-64 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto mobile-scroll">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-3 py-2">
              Select Subject
            </div>
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectSelect(subject)}
                className={`w-full text-left px-3 py-3 sm:py-2 rounded-md text-sm transition-colors touch-manipulation active:scale-98 ${selectedSubject === subject
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Grade Display (readonly as per README spec) */}
          <div className="border-t border-gray-200 dark:border-gray-600 p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Current Grade
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {selectedGrade}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;

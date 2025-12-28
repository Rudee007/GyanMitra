import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const MultiSelect = ({ options, selected, onChange, placeholder = "Select options..." }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const removeItem = (option) => {
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="relative">
      {/* Selected Items Display */}
      <div className="min-h-[48px] w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
        <div className="flex flex-wrap gap-2">
          {selected.length === 0 ? (
            <span className="text-gray-500 dark:text-gray-400 py-1">{placeholder}</span>
          ) : (
            selected.map(item => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(item)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))
          )}
        </div>
      </div>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {options.map(option => (
              <motion.button
                key={option}
                type="button"
                onClick={() => handleToggle(option)}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
              >
                <span className="text-gray-800 dark:text-white">{option}</span>
                {selected.includes(option) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MultiSelect;
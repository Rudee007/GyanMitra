/**
 * Citation Card Component - Clean Design (No Relevance Score)
 * Modern, formal, and minimal
 */

import { BookOpen, MapPin, FileText } from "lucide-react";

const CitationCard = ({ citation, index }) => {
  const {
    number = index,
    source = "NCERT Textbook",
    chapter = "Unknown",
    page = "N/A",
    excerpt = "",
    chunkId = "",
  } = citation;

  // Clean chapter name
  const cleanChapter = (ch) => {
    if (!ch || ch === "Unknown" || ch.length > 100) return null;
    if (ch.includes("Publication") || ch.includes("ISBN")) return null;
    return ch;
  };

  const displayChapter = cleanChapter(chapter);

  return (
    <div className="group bg-white dark:bg-gray-800 border-l-4 border-blue-600 dark:border-blue-400 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:translate-x-1">
      {/* Top Section: Number + Source */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          {/* Citation Number */}
          <div className="shrink-0 w-7 h-7 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-white">{number}</span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Source */}
            <div className="flex items-center space-x-2 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {source}
              </p>
            </div>

            {/* Chapter + Page Location */}
            <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
              {displayChapter && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-gray-500 dark:text-gray-500" />
                  <span className="truncate">{displayChapter}</span>
                </div>
              )}
              <div className="flex items-center space-x-1 font-medium text-gray-700 dark:text-gray-300">
                <FileText className="w-3 h-3" />
                <span>Page {page}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Excerpt */}
      {excerpt && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-lg p-3">
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
            "
            {excerpt.length > 160 ? `${excerpt.substring(0, 160)}...` : excerpt}
            "
          </p>
        </div>
      )}
    </div>
  );
};

export default CitationCard;

import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useState } from 'react';

const SplineRobot = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    console.log('Spline 3D model loaded successfully');
  };

  const handleError = (error) => {
    setHasError(true);
    console.error('Spline 3D model failed to load:', error);
  };

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {/* Loading State */}
      {!isLoaded && !hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10 rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center space-y-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-16 h-16 border-4 border-[#667eea] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#667eea] font-medium">Loading 3D Model...</p>
          </motion.div>
        </motion.div>
      )}

      {/* Error State */}
      {hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium">Failed to load 3D model</p>
            <p className="text-red-500 text-sm mt-1">Please check your internet connection</p>
          </div>
        </motion.div>
      )}

      {/* Spline 3D Model */}
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 0.8
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Spline
          scene="https://prod.spline.design/0DRrsIg7SI7bgNhN/scene.splinecode"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '400px'
          }}
        />
      </motion.div>

      {/* Enhanced Background Effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-3xl blur-2xl -z-10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Floating particles around the 3D model */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-[#f093fb] to-[#f5576c] rounded-full"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0, 1, 0],
          scale: [0, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] rounded-full"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          opacity: [0, 1, 0],
          scale: [0, 1, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      />
    </div>
  );
};

export default SplineRobot;

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ScrollIndicator = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 20]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      style={{ y, opacity }}
    >
      <motion.div
        className="flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-300"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;

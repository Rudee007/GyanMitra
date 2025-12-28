import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Users, Globe, BookOpen } from 'lucide-react';
import SplineRobot from '@/components/common/SplineRobot';
import InteractiveBackground from '@/components/common/InteractiveBackground';
import ScrollIndicator from '@/components/common/ScrollIndicator';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [currentStat, setCurrentStat] = useState(0);
  const stats = [
    { number: '10K+', label: 'Students Helped', icon: Users },
    { number: '5-10', label: 'Grade Coverage', icon: BookOpen },
    { number: '10+', label: 'Languages', icon: Globe }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-[#667eea]/10 via-[#764ba2]/5 to-[#f8f9ff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Enhanced Interactive Background */}
      <InteractiveBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Enhanced Left Content */}
          <motion.div 
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y, opacity }}
          >
            {/* Enhanced Title with better typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1f1f1f] dark:text-white leading-tight"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Your Multilingual{' '}
                <span className="bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent bg-[length:200%_100%]">
                  NCERT AI Tutor
                </span>
              </motion.h1>
              
              {/* Enhanced subtitle with animated highlights */}
              <motion.div
                className="mt-4 flex items-center justify-center lg:justify-start space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="flex items-center space-x-1"
                  animate={{ 
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    AI-Powered Learning
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Enhanced description with better readability */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Powered by AI and NCERT textbooks, helping students (Grades 6–10) solve doubts in their own language with{' '}
              <motion.span 
                className="font-semibold text-[#667eea]"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                personalized learning experiences
              </motion.span>
            </motion.p>
            
            {/* Enhanced CTA Section */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#f093fb] to-[#f5576c] hover:from-[#4facfe] hover:to-[#00f2fe] text-white border-0 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                onClick={() => navigate(isAuthenticated ? '/chat' : '/register')}
              >
                <motion.span
                  className="relative z-10 flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-[#667eea] text-[#667eea] hover:bg-[#667eea] hover:text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold transition-all duration-300 group"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Enhanced Stats with animated counters */}
            <motion.div 
              className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 sm:pt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="text-center group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    animate={{ 
                      scale: currentStat === index ? 1.1 : 1,
                      opacity: currentStat === index ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent flex items-center justify-center space-x-2"
                      animate={{ 
                        scale: currentStat === index ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#667eea]" />
                      <span>{stat.number}</span>
                    </motion.div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div
              className="flex items-center justify-center lg:justify-start space-x-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] border-2 border-white dark:border-gray-800"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Join 10,000+ students
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Right Content - 3D Spline Model */}
          <motion.div 
            className="flex justify-center lg:justify-end mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: useTransform(scrollY, [0, 300], [0, 30]) }}
          >
            <div className="w-full max-w-md lg:max-w-lg relative">
              <SplineRobot />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
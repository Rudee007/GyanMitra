import { motion } from 'framer-motion';
import { Upload, Search, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload or Ask",
      description: "Type your question or upload image",
      gradient: "from-[#f093fb] to-[#f5576c]"
    },
    {
      icon: Search,
      title: "AI Searches NCERT",
      description: "Finds correct content from textbooks",
      gradient: "from-[#4facfe] to-[#00f2fe]"
    },
    {
      icon: CheckCircle,
      title: "Get Answer + Citation",
      description: "Accurate, multilingual explanations",
      gradient: "from-[#667eea] to-[#764ba2]"
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#f8f9ff] dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          {...fadeInUp}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f1f1f] dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get your NCERT doubts solved in just three simple steps
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={fadeInUp} className="text-center relative">
              {/* Step Number */}
              <motion.div 
                className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center text-white font-bold text-sm z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {index + 1}
              </motion.div>

              {/* Icon Container */}
              <motion.div 
                className="relative mb-6 sm:mb-8"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                  <step.icon className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
                
                {/* Connecting Arrow */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 -right-6 lg:-right-8"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                  >
                    <ArrowRight className="h-6 w-6 lg:h-8 lg:w-8 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                )}
              </motion.div>

              {/* Content */}
              <motion.div 
                className="space-y-3 sm:space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-[#1f1f1f] dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>

              {/* Mobile Arrow */}
              {index < steps.length - 1 && (
                <motion.div 
                  className="md:hidden flex justify-center mt-6 sm:mt-8"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.8 }}
                >
                  <div className="w-1 h-8 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] dark:text-white mb-4">
              Ready to solve your doubts?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of students who are already learning smarter with our AI tutor
            </p>
            <motion.button 
              className="bg-gradient-to-r from-[#f093fb] to-[#f5576c] hover:from-[#4facfe] hover:to-[#00f2fe] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try It Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
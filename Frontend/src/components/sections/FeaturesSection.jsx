import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit, Globe, FileText, MessageCircle } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Doubt Solving",
      description: "Ask any question from NCERT",
      gradient: "from-[#667eea] to-[#764ba2]"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Works in Hindi, English, Urdu & more",
      gradient: "from-[#f093fb] to-[#f5576c]"
    },
    {
      icon: FileText,
      title: "Cited Answers",
      description: "Every answer linked to the NCERT source",
      gradient: "from-[#4facfe] to-[#00f2fe]"
    },
    {
      icon: MessageCircle,
      title: "Conversational Mode",
      description: "Continue chatting for deeper learning",
      gradient: "from-[#a8edea] to-[#fed6e3]"
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
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          {...fadeInUp}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
            Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover how our AI-powered platform makes learning NCERT concepts easier and more accessible
          </p>
        </motion.div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-white dark:bg-gray-800 group">
                <CardContent className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
                  <motion.div 
                    className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-[#1f1f1f] dark:text-white">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative Element */}
                  <motion.div 
                    className={`w-12 h-1 mx-auto bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1f1f1f] dark:text-white mb-4">
              Why Choose GyanMitra?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our platform combines the power of artificial intelligence with the trusted NCERT curriculum, 
              ensuring students get accurate, contextual answers in their preferred language. 
              Perfect for grades 5-10 across all subjects.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
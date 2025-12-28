import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Heart, Award } from 'lucide-react';

const AboutSection = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Making quality education accessible to every student"
    },
    {
      icon: Heart,
      title: "Our Passion",
      description: "Empowering students to learn in their native language"
    },
    {
      icon: Award,
      title: "Our Goal",
      description: "Bridging the gap between students and NCERT knowledge"
    }
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f1f1f] dark:text-white mb-4 sm:mb-6">
                About
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
                Our mission is to make learning simpler and inclusive by helping every student solve their NCERT doubts instantly — in their own language.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-1 gap-4 sm:gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center shrink-0">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f1f1f] dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                { number: '50K+', label: 'Questions Solved' },
                { number: '99%', label: 'Accuracy Rate' },
                { number: '24/7', label: 'Available' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Team Card */}
          <motion.div 
            className="flex justify-center order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="w-full max-w-md border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors bg-white dark:bg-gray-800">
              <CardContent className="p-8 sm:p-12 text-center space-y-6">
                <motion.div 
                  className="w-20 h-20 mx-auto bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="h-10 w-10 text-white" />
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                    Your Team
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Meet the passionate developers behind GyanMitra
                  </p>
                </div>

                <Button 
                  className="bg-linear-to-r from-[#f093fb] to-[#f5576c] hover:from-[#4facfe] hover:to-[#00f2fe] text-white border-0 w-full"
                  size="lg"
                >
                  Meet Our Team
                </Button>

                {/* Decorative Elements */}
                <div className="flex justify-center space-x-2 mt-4">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div 
          className="mt-12 sm:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-linear-to-r from-[#667eea]/5 to-[#764ba2]/5 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 sm:p-8 lg:p-12">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1f1f1f] dark:text-white mb-4 sm:mb-6">
                Why We Built This Platform
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
                We noticed that many students struggle with NCERT concepts due to language barriers and lack of personalized guidance. 
                Our AI-powered platform bridges this gap by providing instant, accurate answers in multiple languages, 
                making quality education accessible to every student regardless of their linguistic background.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {['Inclusive Learning', 'AI-Powered', 'NCERT Aligned', 'Multilingual'].map((tag, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

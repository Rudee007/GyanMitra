import { motion } from 'framer-motion';
import { BrainCircuit, Github, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const contactInfo = [
    { icon: Mail, text: 'support@ncertdoubtsolver.com' },
    { icon: Phone, text: '+91 12345 67890' },
    { icon: MapPin, text: 'New Delhi, India' }
  ];

  return (
    <footer className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div 
              className="lg:col-span-2 space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10" />
                </motion.div>
                <span className="text-xl sm:text-2xl font-bold">GyanMitra</span>
              </div>
              
              <p className="text-gray-200 leading-relaxed max-w-md">
                Empowering students with AI-powered NCERT solutions in their preferred language. 
                Making quality education accessible to everyone, everywhere.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center space-x-3 text-gray-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <motion.a 
                      href={link.href} 
                      className="text-gray-200 hover:text-white transition-colors text-sm sm:text-base"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div 
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold">Resources</h3>
              <ul className="space-y-2 sm:space-y-3">
                {['Help Center', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((item, index) => (
                  <li key={index}>
                    <motion.a 
                      href="#" 
                      className="text-gray-200 hover:text-white transition-colors text-sm sm:text-base"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>

              {/* Newsletter Signup */}
              <div className="mt-6 sm:mt-8">
                <h4 className="text-base font-semibold mb-3">Stay Updated</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                  />
                  <motion.button 
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div 
          className="border-t border-white/20 py-6 sm:py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <p className="text-gray-300 text-sm text-center sm:text-left">
              © 2025 Team Intel. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 sm:space-x-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="text-gray-300 hover:text-white transition-colors"
                  whileHover={{ 
                    scale: 1.2,
                    color: '#f093fb'
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <motion.div 
            className="mt-6 sm:mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-gray-300 text-xs sm:text-sm">
              Made with ❤️ for students across India | Powered by AI & NCERT
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const InteractiveBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    const createParticle = () => {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.02 + 0.01,
        direction: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.2
      };
      setParticles(prev => [...prev.slice(-20), newParticle]);
    };

    const interval = setInterval(createParticle, 2000);
    const mouseMoveListener = window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x * 50,
          y: mousePosition.y * 50,
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#f093fb]/20 to-[#f5576c]/20 rounded-full blur-3xl"
        animate={{
          x: -mousePosition.x * 30,
          y: -mousePosition.y * 30,
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"
          style={{
            left: `${particle.x * 100}%`,
            top: `${particle.y * 100}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity
          }}
          animate={{
            x: [0, Math.cos(particle.direction) * 100],
            y: [0, Math.sin(particle.direction) * 100],
            opacity: [particle.opacity, 0]
          }}
          transition={{ duration: 3, ease: "easeOut" }}
          onAnimationComplete={() => {
            setParticles(prev => prev.filter(p => p.id !== particle.id));
          }}
        />
      ))}

      {/* Interactive grid pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
        }}
      />
    </div>
  );
};

export default InteractiveBackground;

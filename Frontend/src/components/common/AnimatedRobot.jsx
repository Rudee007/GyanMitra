import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  MessageCircle,
  Zap,
  Brain,
  Cpu,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

const AnimatedRobot = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced eye tracking animation using Framer Motion
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);

  // Transform mouse position to eye movement
  const eyeTransformX = useTransform(eyeX, [-1, 1], [-3, 3]);
  const eyeTransformY = useTransform(eyeY, [-1, 1], [-2, 2]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      setMousePosition({ x, y });

      // Update eye tracking
      eyeX.set(x);
      eyeY.set(y);
    }
  };

  return (
    <div
      ref={ref}
      className="relative flex justify-center items-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-80 h-80 sm:w-96 sm:h-96"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }}
        transition={{ duration: 0.8 }}
      >
        {/* Enhanced Robot Body with realistic shadows */}
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-3xl shadow-2xl"
          animate={{
            scale: isHovered ? 1.05 : 1.02,
            boxShadow: [
              "0 25px 50px -12px rgba(102, 126, 234, 0.25)",
              "0 25px 50px -12px rgba(118, 75, 162, 0.4)",
              "0 25px 50px -12px rgba(102, 126, 234, 0.25)",
            ],
          }}
          transition={{
            scale: { duration: 0.3 },
            boxShadow: { duration: 3, repeat: Infinity },
          }}
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(102, 126, 234, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        />

        {/* Enhanced Robot Screen with realistic display */}
        <motion.div
          className="absolute top-8 left-8 right-8 bottom-20 bg-white dark:bg-gray-800 rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {/* Enhanced Robot Face with eye tracking */}
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, 5, -5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            {/* Enhanced Eyes with realistic tracking */}
            <div className="flex space-x-4 mb-4">
              <motion.div
                className="w-6 h-6 bg-linear-to-r from-[#4facfe] to-[#00f2fe] rounded-full relative"
                style={{
                  x: eyeTransformX,
                  y: eyeTransformY,
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.div
                className="w-6 h-6 bg-linear-to-r from-[#4facfe] to-[#00f2fe] rounded-full relative"
                style={{
                  x: eyeTransformX,
                  y: eyeTransformY,
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white rounded-full opacity-20"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
                />
              </motion.div>
            </div>

            {/* Enhanced Mouth with realistic expressions */}
            <motion.div
              className="w-8 h-4 border-2 border-gray-400 dark:border-gray-300 rounded-full relative"
              animate={{
                scaleX: [1, 1.1, 1],
                scaleY: [1, 0.9, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-pink-200 to-purple-200 rounded-full"
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Animated Text Lines with realistic typing */}
          <div className="space-y-2 w-full px-4">
            <motion.div
              className="h-2 bg-linear-to-r from-[#f093fb] to-[#f5576c] rounded-full relative"
              animate={{ width: ["0%", "60%", "80%", "60%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="absolute right-0 top-0 w-1 h-full bg-white rounded-full"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </motion.div>
            <motion.div
              className="h-2 bg-linear-to-r from-[#4facfe] to-[#00f2fe] rounded-full relative"
              animate={{ width: ["0%", "40%", "70%", "40%"] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <motion.div
                className="absolute right-0 top-0 w-1 h-full bg-white rounded-full"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>
            <motion.div
              className="h-2 bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-full relative"
              animate={{ width: ["0%", "70%", "50%", "70%"] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <motion.div
                className="absolute right-0 top-0 w-1 h-full bg-white rounded-full"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </div>

          {/* Enhanced Typing Cursor with realistic blinking */}
          <motion.div
            className="absolute bottom-4 right-4 w-1 bg-linear-to-t from-[#f093fb] to-[#f5576c] rounded-full"
            animate={{
              opacity: [1, 0, 1, 0, 1],
              height: [24, 20, 24, 20, 24],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Enhanced Robot Arms with more realistic movement */}
        <motion.div
          className="absolute -left-4 top-1/2 w-8 h-16 bg-linear-to-b from-[#667eea] to-[#764ba2] rounded-full shadow-lg"
          animate={{
            rotate: [0, 15, -5, 0],
            y: [-3, 3, -3],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-4 top-1/2 w-8 h-16 bg-linear-to-b from-[#667eea] to-[#764ba2] rounded-full shadow-lg"
          animate={{
            rotate: [0, -15, 5, 0],
            y: [3, -3, 3],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Enhanced Floating Icons with more realistic physics */}
        <motion.div
          className="absolute -top-8 -right-8 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity },
            rotate: { duration: 10, repeat: Infinity },
            scale: { duration: 2, repeat: Infinity },
          }}
        >
          <Brain className="h-6 w-6 text-purple-600" />
        </motion.div>

        <motion.div
          className="absolute -bottom-4 -left-8 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [15, -15, 15],
            x: [-8, 8, -8],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Zap className="h-5 w-5 text-yellow-500" />
        </motion.div>

        <motion.div
          className="absolute top-1/4 -right-12 w-14 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <MessageCircle className="h-6 w-6 text-blue-500" />
        </motion.div>

        {/* New floating elements for enhanced realism */}
        <motion.div
          className="absolute top-1/3 -left-12 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Cpu className="h-4 w-4 text-green-500" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 -right-16 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <BookOpen className="h-5 w-5 text-indigo-500" />
        </motion.div>

        {/* Enhanced particle effects */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-linear-to-r from-[#f093fb] to-[#f5576c] rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-linear-to-r from-[#4facfe] to-[#00f2fe] rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />

        {/* Enhanced glow effects */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: [
              "0 0 20px rgba(102, 126, 234, 0.3)",
              "0 0 40px rgba(118, 75, 162, 0.4)",
              "0 0 20px rgba(102, 126, 234, 0.3)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default AnimatedRobot;
